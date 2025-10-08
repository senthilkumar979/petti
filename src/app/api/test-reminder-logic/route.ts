import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper function to parse reminder days
function parseReminderDays(reminder: string): number {
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

// Helper function to check if reminder should be sent today
function shouldSendReminder(
  renewalDate: string,
  reminderDays: number
): boolean {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const reminderDate = new Date(renewal);
  reminderDate.setDate(reminderDate.getDate() - reminderDays);

  // Check if today matches the reminder date (within same day)
  return (
    today.getFullYear() === reminderDate.getFullYear() &&
    today.getMonth() === reminderDate.getMonth() &&
    today.getDate() === reminderDate.getDate()
  );
}

export async function GET() {
  try {
    console.log("🧪 Testing Reminder Logic");

    // Get all subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("*");

    if (subscriptionsError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch subscriptions",
        details: subscriptionsError,
      });
    }

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, name");

    if (usersError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch users",
        details: usersError,
      });
    }

    const today = new Date();
    const testResults = [];

    // Test each subscription
    for (const subscription of subscriptions || []) {
      const paidForUser = users?.find(
        (user) => user.id === subscription.paidFor
      );

      if (!paidForUser) {
        testResults.push({
          subscription: subscription.nameOfSubscription,
          renewalDate: subscription.renewalDate,
          paidFor: subscription.paidFor,
          userFound: false,
          reminders: [],
        });
        continue;
      }

      const reminders = [
        {
          type: "reminderOne",
          days: parseReminderDays(subscription.reminderOne),
          setting: subscription.reminderOne,
        },
        {
          type: "reminderTwo",
          days: parseReminderDays(subscription.reminderTwo),
          setting: subscription.reminderTwo,
        },
        {
          type: "reminderThree",
          days: parseReminderDays(subscription.reminderThree),
          setting: subscription.reminderThree,
        },
      ];

      const subscriptionResults = reminders.map((reminder) => {
        const shouldSend =
          reminder.days > 0 &&
          shouldSendReminder(subscription.renewalDate, reminder.days);

        return {
          type: reminder.type,
          setting: reminder.setting,
          days: reminder.days,
          shouldSend,
          renewalDate: subscription.renewalDate,
          userEmail: paidForUser.email,
        };
      });

      testResults.push({
        subscription: subscription.nameOfSubscription,
        renewalDate: subscription.renewalDate,
        userEmail: paidForUser.email,
        reminders: subscriptionResults,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Reminder logic test completed",
      today: today.toISOString().split("T")[0],
      results: testResults,
    });
  } catch (error) {
    console.error("Error in test reminder logic:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test reminder logic",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
