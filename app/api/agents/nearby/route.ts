import { NextRequest, NextResponse } from 'next/server';
import { Agent, Rating } from '@/lib/models';
import sequelize from '@/lib/database';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '10'); // km

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    // Calculate bounding box for efficient filtering
    const latDelta = radius / 111; // Rough conversion: 1 degree ≈ 111 km
    const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180));

    const agents = await Agent.findAll({
      where: {
        is_online: true,
        latitude: {
          [Op.between]: [lat - latDelta, lat + latDelta]
        },
        longitude: {
          [Op.between]: [lng - lngDelta, lng + lngDelta]
        },
        latitude: { [Op.not]: null },
        longitude: { [Op.not]: null }
      },
      attributes: [
        'id', 'name', 'email', 'phone', 'location', 'branch', 'latitude', 'longitude',
        [sequelize.fn('AVG', sequelize.col('ratings.rating_value')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('ratings.id')), 'totalRatings']
      ],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: [],
          required: false
        }
      ],
      group: ['Agent.id']
    });

    // Calculate exact distance and filter by radius
    const nearbyAgents = agents
      .map(agent => {
        const agentLat = parseFloat(agent.latitude as any);
        const agentLng = parseFloat(agent.longitude as any);
        const distance = calculateDistance(lat, lng, agentLat, agentLng);

        return {
          ...agent.toJSON(),
          distance,
          averageRating: agent.getDataValue('averageRating') ? 
            parseFloat(agent.getDataValue('averageRating')) : null,
          totalRatings: parseInt(agent.getDataValue('totalRatings')) || 0
        };
      })
      .filter(agent => agent.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json({ agents: nearbyAgents });
  } catch (error) {
    console.error('Error fetching nearby agents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}