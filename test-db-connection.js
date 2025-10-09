// Test database connection directly
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing");
  console.log(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    supabaseKey ? "Set" : "Missing"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testDatabaseConnection = async () => {
  console.log("🔍 Testing Database Connection");
  console.log("=".repeat(50));

  try {
    // Test basic connection
    console.log("Testing basic connection...");
    const { data, error } = await supabase
      .from("subscriptions")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Database connection failed:", error);
      return;
    }

    console.log("✅ Database connection successful");

    // Get all subscriptions
    console.log("\n📋 Fetching subscriptions...");
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("*");

    if (subscriptionsError) {
      console.error("❌ Error fetching subscriptions:", subscriptionsError);
      return;
    }

    console.log(`✅ Found ${subscriptions?.length || 0} subscriptions`);

    if (subscriptions && subscriptions.length > 0) {
      console.log("\n📊 Subscription Details:");
      console.log("-".repeat(40));

      subscriptions.forEach((sub, index) => {
        console.log(`\n${index + 1}. ${sub.nameOfSubscription}`);
        console.log(`   Renewal Date: ${sub.renewalDate}`);
        console.log(`   Reminder 1: ${sub.reminderOne}`);
        console.log(`   Reminder 2: ${sub.reminderTwo}`);
        console.log(`   Reminder 3: ${sub.reminderThree}`);
        console.log(`   Paid For: ${sub.paidFor}`);

        // Test reminder logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const renewalDate = new Date(sub.renewalDate);
        renewalDate.setHours(0, 0, 0, 0);

        const daysUntilRenewal = Math.ceil(
          (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        console.log(`   Days until renewal: ${daysUntilRenewal}`);

        // Check if any reminders should be sent today
        const reminders = [
          { type: "reminderOne", setting: sub.reminderOne },
          { type: "reminderTwo", setting: sub.reminderTwo },
          { type: "reminderThree", setting: sub.reminderThree },
        ];

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
          }
        });
      });
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
testDatabaseConnection();
