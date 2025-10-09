// Test Netflix reminder specifically
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const testNetflixReminder = async () => {
  console.log("🔍 Testing Netflix Reminder");
  console.log("=".repeat(50));

  try {
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
    console.log("✅ Found Netflix subscription:");
    console.log(`   Renewal Date: ${netflix.renewalDate}`);
    console.log(`   Reminder 1: ${netflix.reminderOne}`);
    console.log(`   Reminder 2: ${netflix.reminderTwo}`);
    console.log(`   Reminder 3: ${netflix.reminderThree}`);

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

    // Check each reminder
    const reminders = [
      { type: "reminderOne", setting: netflix.reminderOne },
      { type: "reminderTwo", setting: netflix.reminderTwo },
      { type: "reminderThree", setting: netflix.reminderThree },
    ];

    let shouldSendReminder = false;
    let reminderType = "";

    reminders.forEach((reminder) => {
      const days = parseReminderDays(reminder.setting);
      if (days > 0) {
        const reminderDate = new Date(renewalDate);
        reminderDate.setDate(reminderDate.getDate() - days);

        const shouldSend =
          today.getFullYear() === reminderDate.getFullYear() &&
          today.getMonth() === reminderDate.getMonth() &&
          today.getDate() === reminderDate.getDate();

        console.log(
          `   ${reminder.type} (${reminder.setting}): ${
            shouldSend ? "✅ SEND TODAY" : "❌ Not today"
          }`
        );

        if (shouldSend) {
          shouldSendReminder = true;
          reminderType = reminder.type;
        }
      }
    });

    if (shouldSendReminder) {
      console.log(
        `\n📧 Netflix reminder should be sent today (${reminderType})`
      );
      console.log("🔧 Testing email sending...");

      // Test SMTP configuration
      const smtpConfig = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "mentorbridgeindia@gmail.com",
          pass: "your-app-password", // You'll need to set this
        },
      };

      console.log(
        "⚠️  Note: You need to configure SMTP settings in the app to send emails"
      );
      console.log("   Go to Settings → Email Settings to configure SMTP");
    } else {
      console.log("❌ No reminders should be sent today for Netflix");
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

// Run the test
testNetflixReminder();
