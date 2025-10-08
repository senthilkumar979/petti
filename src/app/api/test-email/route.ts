import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    console.log("📧 Testing Email Sending");
    console.log(
      "RESEND_API_KEY:",
      process.env.RESEND_API_KEY ? "SET" : "NOT SET"
    );

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not set",
        message: "Please check your .env.local file",
      });
    }

    // Test email sending
    const testEmail = {
      from: "Petti Subscriptions <no-reply@mentorbridgeindia.in>",
      to: ["no-reply@mentorbridgeindia.in"],
      subject: "🧪 Test Email from Petti",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your Petti subscription reminder system.</p>
        <p>If you receive this, the email system is working!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    };

    console.log("Sending test email...");
    const { data, error } = await resend.emails.send(testEmail);

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json({
        success: false,
        error: "Failed to send email",
        details: error,
      });
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      emailId: data?.id,
      details: data,
    });
  } catch (error) {
    console.error("Error in test email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
