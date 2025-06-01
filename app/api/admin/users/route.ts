import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User, Agent, Employee } from "@/lib/models";
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
    const role = searchParams.get("role");
    const approved = searchParams.get("approved");
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    const whereClause: any = {};
    if (role) whereClause.role = role;
    if (approved !== null) whereClause.is_approved = approved === "true";
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: ["id", "name", "email", "role", "is_approved", "created_at"],
      include: [
        {
          model: Agent,
          as: "agent",
          attributes: ["id", "name", "branch"],
          required: false,
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name", "department"],
          required: false,
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return NextResponse.json({
      users: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
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
    const { id, is_approved, role } = body;

    const updateData: any = {};
    if (is_approved !== undefined) updateData.is_approved = is_approved;
    if (role) updateData.role = role;

    const [updatedRowsCount] = await User.update(updateData, {
      where: { id },
    });

    if (updatedRowsCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "is_approved", "created_at"],
      include: [
        {
          model: Agent,
          as: "agent",
          attributes: ["id", "name", "branch"],
          required: false,
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name", "department"],
          required: false,
        },
      ],
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
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
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Don't allow deleting the current admin user
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    const deletedRowsCount = await User.destroy({
      where: { id: parseInt(id) },
    });

    if (deletedRowsCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
