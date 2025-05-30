import { NextRequest, NextResponse } from 'next/server';
import { Agent, Rating, Question } from '@/lib/models';
import sequelize from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const agent = await Agent.findByPk(id, {
      attributes: [
        'id', 'name', 'email', 'phone', 'location', 'branch', 'latitude', 'longitude', 'is_online',
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

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const result = {
      ...agent.toJSON(),
      averageRating: agent.getDataValue('averageRating') ? 
        parseFloat(agent.getDataValue('averageRating')) : null,
      totalRatings: parseInt(agent.getDataValue('totalRatings')) || 0
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}