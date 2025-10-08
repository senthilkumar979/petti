import { NextRequest, NextResponse } from "next/server";
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
    case "4 days before":
      return 4;
    case "5 days before":
      return 5;
    case "6 days before":
      return 6;
    case "1 week before":
      return 7;
    case "2 weeks before":
      return 14;
    case "10 days before":
      return 10;
    case "15 days before":
      return 15;
    case "20 days before":
      return 20;
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

  return (
    today.getFullYear() === reminderDate.getFullYear() &&
    today.getMonth() === reminderDate.getMonth() &&
    today.getDate() === reminderDate.getDate()
  );
}

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 TESTING REMINDER PROCESSING");

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
    const remindersToSend = [];

    // Process each subscription
    for (const subscription of subscriptions || []) {
      const paidForUser = users?.find(
        (user) => user.id === subscription.paidFor
      );

      if (!paidForUser) {
        continue;
      }

      // Check each reminder setting
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

      for (const reminder of reminders) {
        const shouldSend =
          reminder.days > 0 &&
          shouldSendReminder(subscription.renewalDate, reminder.days);

        if (shouldSend) {
          remindersToSend.push({
            subscription: subscription.nameOfSubscription,
            renewalDate: subscription.renewalDate,
            reminderType: reminder.type,
            reminderSetting: reminder.setting,
            userEmail: paidForUser.email,
            shouldSend,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Reminder processing test completed",
      today: today.toISOString().split("T")[0],
      totalSubscriptions: subscriptions?.length || 0,
      totalUsers: users?.length || 0,
      remindersToSend: remindersToSend.length,
      reminders: remindersToSend,
    });
  } catch (error) {
    console.error("Error in test reminder processing:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test reminder processing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
