import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Agent, Employee, User } from "@/lib/models";
import { generateQRCode, generateUniqueQRData } from "@/lib/utils/qr";

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

    // Generate QR code data URL
    const qrData = generateUniqueQRData(
      isAgent ? "agent" : "employee",
      profile.id,
    );
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
