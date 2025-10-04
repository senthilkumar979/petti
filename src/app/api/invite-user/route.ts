import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, name, inviterName, inviterEmail } = await request.json();

    if (!email || !name || !inviterName || !inviterEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Send invitation email to the new user
    // 2. Send notification email to the inviter
    // 3. Use a service like SendGrid, Resend, or AWS SES

    console.log("Invitation email would be sent to:", email);
    console.log("Notification email would be sent to:", inviterEmail);

    // For now, we'll just return success
    // In production, you would integrate with your email service here
    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
