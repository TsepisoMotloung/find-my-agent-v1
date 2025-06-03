import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Agent, Employee, User } from "@/lib/models";
import { generateQRCode, generateUniqueQRData } from "@/lib/utils/qr";

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
    let profile: any;
    let profileType: string;

    if (user.role === "agent") {
      profile = await Agent.findOne({ where: { user_id: user.id } });
      profileType = "agent";
    } else if (user.role === "frontline") {
      profile = await Employee.findOne({ where: { user_id: user.id } });
      profileType = "employee";
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }

    if (!profile) {
      return NextResponse.json(
        {
          error: `${profileType} profile not found`,
        },
        { status: 404 },
      );
    }

    // Generate QR code data URL
    const qrData = generateUniqueQRData(profileType, profile.id);
    const qrCodeDataURL = await generateQRCode(qrData);

    // Convert data URL to buffer
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Return as PNG image
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${profile.name}-qr-code.png"`,
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
