import { NextRequest, NextResponse } from "next/server";
import { Employee, Rating } from "@/lib/models";
import sequelize from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);

    const employee = await Employee.findByPk(id, {
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
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    const result = {
      ...employee.toJSON(),
      averageRating: employee.getDataValue("averageRating")
        ? parseFloat(employee.getDataValue("averageRating"))
        : null,
      totalRatings: parseInt(employee.getDataValue("totalRatings")) || 0,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
