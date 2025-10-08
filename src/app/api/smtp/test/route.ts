import { SMTPService } from "@/lib/smtp";
import { SMTPConfig } from "@/types/smtp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config, testEmail } = body;

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: "No SMTP configuration provided",
        },
        { status: 400 }
      );
    }

    if (!testEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "No test email address provided",
        },
        { status: 400 }
      );
    }

    // Create SMTP service with provided config
    const smtpService = new SMTPService(config as SMTPConfig);

    // Test connection
    const connectionTest = await smtpService.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: "SMTP connection failed",
          details: connectionTest,
        },
        { status: 400 }
      );
    }

    // Send test email
    const emailTest = await smtpService.sendTestEmail(testEmail);

    return NextResponse.json({
      success: emailTest.success,
      message: emailTest.message,
      connectionTest,
      emailTest,
    });
  } catch (error) {
    console.error("Error testing SMTP:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test SMTP configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
