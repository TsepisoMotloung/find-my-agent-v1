import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Agent, Rating } from '@/lib/models';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all agents with their ratings statistics
    const agents = await Agent.findAll({
      attributes: [
        'id', 'name', 'email', 'phone', 'location', 'branch', 
        'latitude', 'longitude', 'is_online', 'created_at',
        [sequelize.fn('COUNT', sequelize.col('ratings.id')), 'total_ratings'],
        [sequelize.fn('AVG', sequelize.col('ratings.rating_value')), 'average_rating']
      ],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: [],
          required: false
        }
      ],
      group: ['Agent.id'],
      order: [['name', 'ASC']]
    });

    // Convert to CSV format
    const csvHeaders = [
      'ID',
      'Name', 
      'Email',
      'Phone',
      'Location',
      'Branch',
      'Latitude',
      'Longitude',
      'Online Status',
      'Total Ratings',
      'Average Rating',
      'Created Date'
    ];

    const csvRows = agents.map(agent => [
      agent.id,
      `"${agent.name}"`,
      agent.email,
      agent.phone,
      `"${agent.location}"`,
      `"${agent.branch}"`,
      agent.latitude || '',
      agent.longitude || '',
      agent.is_online ? 'Online' : 'Offline',
      agent.getDataValue('total_ratings') || 0,
      agent.getDataValue('average_rating') ? 
        parseFloat(agent.getDataValue('average_rating')).toFixed(2) : '0.00',
      new Date(agent.created_at).toLocaleDateString()
    ]);

    // Generate CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `agents-export-${timestamp}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error exporting agents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}