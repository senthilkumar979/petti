// Test SMTP configuration directly
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const testSMTPDirect = async () => {
  console.log("🔧 Testing SMTP Configuration Directly");
  console.log("=".repeat(50));

  try {
    // Get active SMTP configuration
    const { data: smtpConfigs, error: smtpError } = await supabase
      .from("smtp_config")
      .select("*")
      .eq("isActive", true);

    if (smtpError) {
      console.error("❌ Error fetching SMTP config:", smtpError);
      return;
    }

    if (!smtpConfigs || smtpConfigs.length === 0) {
      console.log("❌ No active SMTP configuration found");
      return;
    }

    const config = smtpConfigs[0];
    console.log("✅ Found active SMTP configuration:");
    console.log(`   Provider: ${config.provider}`);
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Username: ${config.username}`);
    console.log(`   From Email: ${config.fromEmail}`);

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password, // This might be the issue - password might be missing
      },
    });

    console.log("\n🔧 Testing SMTP connection...");

    // Test connection
    try {
      await transporter.verify();
      console.log("✅ SMTP connection successful!");
    } catch (error) {
      console.error("❌ SMTP connection failed:", error.message);
      console.log("\n💡 Possible issues:");
      console.log("   1. Gmail App Password not set correctly");
      console.log("   2. 2-Factor Authentication not enabled");
      console.log("   3. Less secure app access not enabled");
      console.log("   4. Password field might be empty in database");
      return;
    }

    // Test sending email
    console.log("\n📧 Testing email sending...");

    const mailOptions = {
      from: `${config.fromName} <${config.fromEmail}>`,
      to: "senthilk979@gmail.com", // Your email
      subject: "🧪 Petti SMTP Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🧪 SMTP Test Successful!</h2>
          <p>This is a test email from your Petti application.</p>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>Provider: ${config.provider}</li>
            <li>Host: ${config.host}</li>
            <li>Port: ${config.port}</li>
            <li>From: ${config.fromEmail}</li>
          </ul>
          <p>If you received this email, your SMTP configuration is working correctly!</p>
        </div>
      `,
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Test email sent successfully!");
      console.log(`   Message ID: ${result.messageId}`);
      console.log("📧 Check your email inbox!");
    } catch (error) {
      console.error("❌ Failed to send test email:", error.message);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
};

// Run the test
testSMTPDirect();
