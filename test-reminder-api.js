// Test reminder API directly
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const testReminderAPI = async () => {
  console.log("🔔 Testing Reminder API Logic");
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

    const smtpConfig = smtpConfigs[0];
    console.log("✅ Found active SMTP configuration");

    // Get Netflix subscription
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("nameOfSubscription", "Netflix");

    if (subscriptionsError) {
      console.error(
        "❌ Error fetching Netflix subscription:",
        subscriptionsError
      );
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("❌ No Netflix subscription found");
      return;
    }

    const netflix = subscriptions[0];
    console.log(`✅ Found Netflix subscription (${netflix.renewalDate})`);

    // Get user details
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", netflix.paidFor);

    if (usersError) {
      console.error("❌ Error fetching user:", usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log("❌ No user found for Netflix subscription");
      return;
    }

    const user = users[0];
    console.log(`✅ Found user: ${user.email} (${user.name})`);

    // Test reminder logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewalDate = new Date(netflix.renewalDate);
    renewalDate.setHours(0, 0, 0, 0);

    const daysUntilRenewal = Math.ceil(
      (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    console.log(`📅 Days until renewal: ${daysUntilRenewal}`);

    // Check if reminder should be sent
    const reminderDays = parseReminderDays(netflix.reminderOne);
    if (reminderDays > 0) {
      const reminderDate = new Date(renewalDate);
      reminderDate.setDate(reminderDate.getDate() - reminderDays);

      const shouldSend =
        today.getFullYear() === reminderDate.getFullYear() &&
        today.getMonth() === reminderDate.getMonth() &&
        today.getDate() === reminderDate.getDate();

      console.log(
        `🔔 Reminder 1 (${netflix.reminderOne}): ${
          shouldSend ? "✅ SEND TODAY" : "❌ Not today"
        }`
      );

      if (shouldSend) {
        console.log("\n📧 Netflix reminder should be sent today!");
        console.log("🔧 Testing email sending directly...");

        // Create email template
        const emailHtml = createEmailTemplate(netflix, user);

        // Create SMTP transporter
        const transporter = nodemailer.createTransport({
          host: smtpConfig.host,
          port: smtpConfig.port,
          secure: smtpConfig.secure,
          auth: {
            user: smtpConfig.username,
            pass: smtpConfig.password,
          },
        });

        // Send email
        const mailOptions = {
          from: `${smtpConfig.fromName} <${smtpConfig.fromEmail}>`,
          to: user.email,
          subject: `🔔 Subscription Reminder: ${netflix.nameOfSubscription}`,
          html: emailHtml,
        };

        try {
          const result = await transporter.sendMail(mailOptions);
          console.log("✅ Netflix reminder email sent successfully!");
          console.log(`   Message ID: ${result.messageId}`);
          console.log(`   To: ${user.email}`);
          console.log("📧 Check your email inbox for the Netflix reminder!");
        } catch (error) {
          console.error(
            "❌ Failed to send Netflix reminder email:",
            error.message
          );
        }
      }
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
};

// Helper function to parse reminder days
function parseReminderDays(reminder) {
  switch (reminder) {
    case "1 day before":
      return 1;
    case "2 days before":
      return 2;
    case "3 days before":
      return 3;
    case "1 week before":
      return 7;
    case "10 days before":
      return 10;
    default:
      return 0;
  }
}

// Email template function
function createEmailTemplate(subscription, user) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Reminder</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Subscription Reminder</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hello ${user.name},</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          This is a friendly reminder that your subscription <strong>${
            subscription.nameOfSubscription
          }</strong> 
          is due for renewal soon.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #495057;">Subscription Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 8px 0;"><strong>Name:</strong> <span style="display: inline-block; padding: 4px 8px; background-color: #00b3ee; color: white; border-radius: 4px;">${
              subscription.nameOfSubscription
            }</span></li>
            <li style="margin: 8px 0;"><strong>Amount:</strong> <span style="display: inline-block; padding: 4px 8px; background-color: #4CAF50; color: white; border-radius: 4px;">${
              subscription.currency
            } ${subscription.amount}</span></li>
            <li style="margin: 8px 0;"><strong>Renewal Date:</strong> <span style="display: inline-block; padding: 4px 8px; background-color: #800080; color: white; border-radius: 4px;">${new Date(
              subscription.renewalDate
            ).toLocaleDateString()}</span></li>
            <li style="margin: 8px 0;"><strong>Periodicity:</strong> <span style="display: inline-block; padding: 4px 8px; background-color: #ff6347; color: white; border-radius: 4px;">${
              subscription.periodicity
            }</span></li>
          </ul>
        </div>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1976d2; font-weight: 500;">
            💡 Don't forget to renew your subscription to avoid any service interruptions!
          </p>
        </div>
        
        <p style="margin-bottom: 0; color: #6c757d; font-size: 14px;">
          This is an automated reminder from your Petti subscription management system.
        </p>
      </div>
    </body>
    </html>
  `;
}

// Run the test
testReminderAPI();
