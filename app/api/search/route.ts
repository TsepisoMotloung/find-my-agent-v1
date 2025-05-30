import { NextRequest, NextResponse } from "next/server";
import { Agent, Employee, Rating } from "@/lib/models";
import { Op } from "sequelize";
import sequelize from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "agent";

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query.trim()}%`;

    if (type === "agent") {
      const agents = await Agent.findAll({
        where: {
          name: {
            [Op.like]: searchTerm,
          },
        },
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "location",
          "branch",
          [
            sequelize.fn("AVG", sequelize.col("ratings.rating_value")),
            "averageRating",
          ],
          [sequelize.fn("COUNT", sequelize.col("ratings.id")), "totalRatings"],
        ],
        include: [
          {
            model: Rating,
            as: "ratings",
            attributes: [],
            required: false,
          },
        ],
        group: ["Agent.id"],
        limit: 20,
      });

      const results = agents.map((agent) => ({
        ...agent.toJSON(),
        averageRating: agent.getDataValue("averageRating")
          ? parseFloat(agent.getDataValue("averageRating"))
          : null,
        totalRatings: parseInt(agent.getDataValue("totalRatings")) || 0,
      }));

      return NextResponse.json({ results });
    } else {
      const employees = await Employee.findAll({
        where: {
          name: {
            [Op.like]: searchTerm,
          },
        },
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "department",
          "position",
          "branch",
          [
            sequelize.fn("AVG", sequelize.col("ratings.rating_value")),
            "averageRating",
          ],
          [sequelize.fn("COUNT", sequelize.col("ratings.id")), "totalRatings"],
        ],
        include: [
          {
            model: Rating,
            as: "ratings",
            attributes: [],
            required: false,
          },
        ],
        group: ["Employee.id"],
        limit: 20,
      });

      const results = employees.map((employee) => ({
        ...employee.toJSON(),
        averageRating: employee.getDataValue("averageRating")
          ? parseFloat(employee.getDataValue("averageRating"))
          : null,
        totalRatings: parseInt(employee.getDataValue("totalRatings")) || 0,
      }));

      return NextResponse.json({ results });
    }
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
