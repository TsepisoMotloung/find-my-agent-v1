import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Agent, Employee, User } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user's agent or employee record
    const user = await User.findOne({
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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAgent = user.role === "agent";
    const profile = isAgent ? user.agent : user.employee;

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
