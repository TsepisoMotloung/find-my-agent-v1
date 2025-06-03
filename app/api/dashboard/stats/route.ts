import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Agent,
  Employee,
  Rating,
  Complaint,
  Question,
  User,
} from "@/lib/models";
import sequelize from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Allow access for agent and frontline users only
    if (!session?.user || session.user.role === "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user first
    const user = await User.findByPk(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the appropriate profile based on role
    let targetId: number;
    let targetField: string;

    if (user.role === "agent") {
      const agent = await Agent.findOne({ where: { user_id: user.id } });
      if (!agent) {
        return NextResponse.json(
          { error: "Agent profile not found" },
          { status: 404 },
        );
      }
      targetId = agent.id;
      targetField = "agent_id";
    } else if (user.role === "frontline") {
      const employee = await Employee.findOne({ where: { user_id: user.id } });
      if (!employee) {
        return NextResponse.json(
          { error: "Employee profile not found" },
          { status: 404 },
        );
      }
      targetId = employee.id;
      targetField = "employee_id";
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }

    // Get rating statistics
    const ratingStats = await Rating.findAll({
      where: { [targetField]: targetId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalRatings"],
        [sequelize.fn("AVG", sequelize.col("rating_value")), "averageRating"],
      ],
      raw: true,
    });

    const totalRatings = parseInt(ratingStats[0]?.totalRatings as any) || 0;
    const averageRating = parseFloat(ratingStats[0]?.averageRating as any) || 0;

    // Get complaint statistics
    const complaintStats = await Complaint.findAll({
      where: { [targetField]: targetId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalComplaints"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(`CASE WHEN status = 'pending' THEN 1 ELSE 0 END`),
          ),
          "pendingComplaints",
        ],
      ],
      raw: true,
    });

    const totalComplaints =
      parseInt(complaintStats[0]?.totalComplaints as any) || 0;
    const pendingComplaints =
      parseInt(complaintStats[0]?.pendingComplaints as any) || 0;

    // Get recent ratings
    const recentRatings = await Rating.findAll({
      where: { [targetField]: targetId },
      include: [
        {
          model: Question,
          as: "question",
          attributes: ["id", "question_text"],
        },
      ],
      limit: 10,
      order: [["created_at", "DESC"]],
    });

    // Get recent complaints
    const recentComplaints = await Complaint.findAll({
      where: { [targetField]: targetId },
      attributes: ["id", "subject", "complainant_name", "status", "created_at"],
      limit: 10,
      order: [["created_at", "DESC"]],
    });

    return NextResponse.json({
      totalRatings,
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalComplaints,
      pendingComplaints,
      recentRatings,
      recentComplaints,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
