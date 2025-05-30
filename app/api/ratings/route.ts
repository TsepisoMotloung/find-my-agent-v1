import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Rating, Agent, Employee, Question } from "@/lib/models";
import { ratingSchema } from "@/lib/validations/schemas";
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
    const agentId = searchParams.get("agent_id");
    const employeeId = searchParams.get("employee_id");

    const offset = (page - 1) * limit;

    const whereClause: any = {};
    if (agentId) whereClause.agent_id = parseInt(agentId);
    if (employeeId) whereClause.employee_id = parseInt(employeeId);

    const { count, rows } = await Rating.findAndCountAll({
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
        {
          model: Question,
          as: "question",
          attributes: ["id", "question_text", "question_type"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return NextResponse.json({
      ratings: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ratingSchema.parse(body);

    // Extract target info
    const { ratings, agent_id, employee_id, ...raterInfo } = body;

    // Validate that we have either agent_id or employee_id
    if (!agent_id && !employee_id) {
      return NextResponse.json(
        { error: "Either agent_id or employee_id is required" },
        { status: 400 },
      );
    }

    // Create ratings for each question
    const createdRatings = [];
    for (const rating of validatedData.ratings) {
      const ratingData = {
        ...raterInfo,
        agent_id: agent_id || null,
        employee_id: employee_id || null,
        question_id: rating.question_id,
        rating_value: rating.rating_value,
        comments: rating.comments || null,
      };

      const createdRating = await Rating.create(ratingData);
      createdRatings.push(createdRating);
    }

    return NextResponse.json(
      {
        message: "Ratings submitted successfully",
        ratings: createdRatings,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ratings:", error);
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
        { error: "Rating ID is required" },
        { status: 400 },
      );
    }

    const deletedRowsCount = await Rating.destroy({
      where: { id: parseInt(id) },
    });

    if (deletedRowsCount === 0) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
