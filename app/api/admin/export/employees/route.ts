import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Employee, Rating } from "@/lib/models";
import sequelize from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all employees with their ratings statistics
    const employees = await Employee.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "department",
        "position",
        "branch",
        "created_at",
        [sequelize.fn("COUNT", sequelize.col("ratings.id")), "total_ratings"],
        [
          sequelize.fn("AVG", sequelize.col("ratings.rating_value")),
          "average_rating",
        ],
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
      order: [["name", "ASC"]],
    });

    // Convert to CSV format
    const csvHeaders = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Department",
      "Position",
      "Branch",
      "Total Ratings",
      "Average Rating",
      "Created Date",
    ];

    const csvRows = employees.map((employee) => [
      employee.id,
      `"${employee.name}"`,
      employee.email,
      employee.phone,
      `"${employee.department}"`,
      `"${employee.position}"`,
      `"${employee.branch}"`,
      employee.getDataValue("total_ratings") || 0,
      employee.getDataValue("average_rating")
        ? parseFloat(employee.getDataValue("average_rating")).toFixed(2)
        : "0.00",
      new Date(employee.created_at).toLocaleDateString(),
    ]);

    // Generate CSV content
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `employees-export-${timestamp}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error exporting employees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
