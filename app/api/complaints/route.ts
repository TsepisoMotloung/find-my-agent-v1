import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Complaint, Agent, Employee } from "@/lib/models";
import { complaintSchema } from "@/lib/validations/schemas";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const type = searchParams.get("type");

    const offset = (page - 1) * limit;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (type) whereClause.complaint_type = type;

    const { count, rows } = await Complaint.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Agent,
          as: "agent",
          attributes: ["id", "name", "email"],
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name", "email"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return NextResponse.json({
      complaints: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = complaintSchema.parse(body);

    const complaint = await Complaint.create({
      ...validatedData,
      agent_id: body.agent_id || null,
      employee_id: body.employee_id || null,
      status: "pending",
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    console.error("Error creating complaint:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, resolution, priority } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (resolution) updateData.resolution = resolution;
    if (priority) updateData.priority = priority;

    if (status === "resolved") {
      updateData.resolved_at = new Date();
    }

    const [updatedRowsCount] = await Complaint.update(updateData, {
      where: { id },
    });

    if (updatedRowsCount === 0) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 },
      );
    }

    const updatedComplaint = await Complaint.findByPk(id, {
      include: [
        {
          model: Agent,
          as: "agent",
          attributes: ["id", "name", "email"],
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return NextResponse.json(updatedComplaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Complaint ID is required" },
        { status: 400 },
      );
    }

    const deletedRowsCount = await Complaint.destroy({
      where: { id: parseInt(id) },
    });

    if (deletedRowsCount === 0) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
