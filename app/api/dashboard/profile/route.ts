import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Agent, Employee, User } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user's agent or employee record
    const user = (await User.findOne({
      where: { id: session.user.id },
      include: [
        {
          model: Agent,
          as: "agent",
          required: false,
        },
        {
          model: Employee,
          as: "employee",
          required: false,
        },
      ],
    })) as any; // Type assertion to handle Sequelize associations

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle different user roles
    if (user.role === "admin") {
      // Admin users don't have agent/employee profiles
      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: "admin",
      });
    }

    const isAgent = user.role === "agent";
    const profile = isAgent ? user.agent : user.employee;

    if (!profile) {
      return NextResponse.json(
        {
          error: `${isAgent ? "Agent" : "Employee"} profile not found. Please contact an administrator.`,
        },
        { status: 404 },
      );
    }

    // Return profile with user info
    return NextResponse.json({
      ...profile.toJSON(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
