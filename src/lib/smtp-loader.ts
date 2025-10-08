import { supabase } from "@/lib/supabase";
import { setGlobalSMTP } from "@/lib/smtp";
import { SMTPConfig } from "@/types/smtp";

export async function loadSMTPConfiguration(): Promise<SMTPConfig | null> {
  try {
    const { data: config, error } = await supabase
      .from("smtp_config")
      .select("*")
      .eq("isActive", true)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading SMTP configuration:", error);
      return null;
    }

    if (config) {
      setGlobalSMTP(config as SMTPConfig);
      console.log("✅ SMTP configuration loaded successfully");
      return config as SMTPConfig;
    }

    console.log("ℹ️ No active SMTP configuration found");
    return null;
  } catch (error) {
    console.error("Error loading SMTP configuration:", error);
    return null;
  }
}
