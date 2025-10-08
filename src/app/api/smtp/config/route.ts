import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SMTPConfig } from "@/types/smtp";
import { setGlobalSMTP, getSMTPService } from "@/lib/smtp";

// Get SMTP configuration
export async function GET() {
  try {
    const { data: config, error } = await supabase
      .from("smtp_config")
      .select("*")
      .eq("isActive", true)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch SMTP configuration",
          details: error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      config: config || null,
    });
  } catch (error) {
    console.error("Error fetching SMTP config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch SMTP configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Create or update SMTP configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      provider,
      host,
      port,
      secure,
      username,
      password,
      fromName,
      fromEmail,
    } = body;

    // Validate required fields
    if (
      !provider ||
      !host ||
      !port ||
      !username ||
      !password ||
      !fromName ||
      !fromEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Please provide all required SMTP configuration fields",
        },
        { status: 400 }
      );
    }

    // Deactivate any existing active configuration
    await supabase
      .from("smtp_config")
      .update({ isActive: false })
      .eq("isActive", true);

    // Create new configuration
    const newConfig: Omit<SMTPConfig, "id" | "createdAt" | "updatedAt"> = {
      provider: provider as SMTPConfig["provider"],
      host,
      port: parseInt(port),
      secure: Boolean(secure),
      username,
      password,
      fromName,
      fromEmail,
      isActive: true,
    };

    const { data, error } = await supabase
      .from("smtp_config")
      .insert(newConfig)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save SMTP configuration",
          details: error,
        },
        { status: 500 }
      );
    }

    // Set global SMTP service
    setGlobalSMTP(data as SMTPConfig);

    return NextResponse.json({
      success: true,
      message: "SMTP configuration saved successfully",
      config: data,
    });
  } catch (error) {
    console.error("Error saving SMTP config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save SMTP configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Delete SMTP configuration
export async function DELETE() {
  try {
    const { error } = await supabase
      .from("smtp_config")
      .update({ isActive: false })
      .eq("isActive", true);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete SMTP configuration",
          details: error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "SMTP configuration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting SMTP config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete SMTP configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
