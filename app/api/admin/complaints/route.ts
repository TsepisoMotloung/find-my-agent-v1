import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Complaint, Agent, Employee } from '@/lib/models';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (type) whereClause.complaint_type = type;
    if (search) {
      whereClause[Op.or] = [
        { subject: { [Op.like]: `%${search}%` } },
        { complainant_name: { [Op.like]: `%${search}%` } },
        { complainant_email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Complaint.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Agent,
          as: 'agent',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'name', 'email']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return NextResponse.json({
      complaints: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, resolution, priority } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (resolution !== undefined) updateData.resolution = resolution;
    if (priority) updateData.priority = priority;

    if (status === 'resolved') {
      updateData.resolved_at = new Date();
    } else if (status && status !== 'resolved') {
      updateData.resolved_at = null;
    }

    const [updatedRowsCount] = await Complaint.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const updatedComplaint = await Complaint.findByPk(id, {
      include: [
        {
          model: Agent,
          as: 'agent',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return NextResponse.json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}