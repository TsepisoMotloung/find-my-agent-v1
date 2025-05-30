import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Agent, Employee, Rating, Complaint, User } from '@/lib/models';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get basic counts
    const [
      totalAgents,
      totalEmployees,
      totalRatings,
      totalComplaints,
      pendingApprovals
    ] = await Promise.all([
      Agent.count(),
      Employee.count(),
      Rating.count(),
      Complaint.count(),
      User.count({ where: { is_approved: false } })
    ]);

    // Calculate average rating
    const ratingStats = await Rating.findAll({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating_value')), 'avgRating']
      ],
      raw: true
    });

    const averageRating = ratingStats[0]?.avgRating || 0;

    // Get recent ratings with associated data
    const recentRatings = await Rating.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Agent,
          as: 'agent',
          attributes: ['id', 'name']
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'name']
        }
      ]
    });

    // Get recent complaints
    const recentComplaints = await Complaint.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'subject', 'complainant_name', 'status', 'created_at']
    });

    return NextResponse.json({
      totalAgents,
      totalEmployees,
      totalRatings,
      totalComplaints,
      averageRating: parseFloat(averageRating.toFixed(2)),
      pendingApprovals,
      recentRatings,
      recentComplaints
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}