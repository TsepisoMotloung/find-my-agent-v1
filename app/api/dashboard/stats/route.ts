import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Agent, Employee, Rating, Complaint, Question, User } from '@/lib/models';
import sequelize from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user's agent or employee record
    const user = await User.findOne({
      where: { id: session.user.id },
      include: [
        {
          model: Agent,
          as: 'agent',
          required: false
        },
        {
          model: Employee,
          as: 'employee',
          required: false
        }
      ]
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAgent = user.role === 'agent';
    const targetId = isAgent ? user.agent?.id : user.employee?.id;
    const targetField = isAgent ? 'agent_id' : 'employee_id';

    if (!targetId) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get rating statistics
    const ratingStats = await Rating.findAll({
      where: { [targetField]: targetId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings'],
        [sequelize.fn('AVG', sequelize.col('rating_value')), 'averageRating']
      ],
      raw: true
    });

    const totalRatings = parseInt(ratingStats[0]?.totalRatings as any) || 0;
    const averageRating = parseFloat(ratingStats[0]?.averageRating as any) || 0;

    // Get complaint statistics
    const complaintStats = await Complaint.findAll({
      where: { [targetField]: targetId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalComplaints'],
        [
          sequelize.fn('SUM', 
            sequelize.literal(`CASE WHEN status = 'pending' THEN 1 ELSE 0 END`)
          ), 
          'pendingComplaints'
        ]
      ],
      raw: true
    });

    const totalComplaints = parseInt(complaintStats[0]?.totalComplaints as any) || 0;
    const pendingComplaints = parseInt(complaintStats[0]?.pendingComplaints as any) || 0;

    // Get recent ratings
    const recentRatings = await Rating.findAll({
      where: { [targetField]: targetId },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['id', 'question_text']
        }
      ],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    // Get recent complaints
    const recentComplaints = await Complaint.findAll({
      where: { [targetField]: targetId },
      attributes: ['id', 'subject', 'complainant_name', 'status', 'created_at'],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    return NextResponse.json({
      totalRatings,
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalComplaints,
      pendingComplaints,
      recentRatings,
      recentComplaints
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}