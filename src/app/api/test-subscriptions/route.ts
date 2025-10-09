import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 Fetching subscriptions for debugging...");

    // Get all subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("*");

    if (subscriptionsError) {
      console.error("Error fetching subscriptions:", subscriptionsError);
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
      console.error("Error fetching users:", usersError);
      return NextResponse.json({
        success: false,
        error: "Failed to fetch users",
        details: usersError,
      });
    }

    // Get all subscription categories for name lookup
    const { data: categories, error: categoriesError } = await supabase
      .from("subscription-categories")
      .select("id, name");

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return NextResponse.json({
        success: false,
        error: "Failed to fetch categories",
        details: categoriesError,
      });
    }

    const categoryMap = new Map();
    if (categories) {
      categories.forEach((cat) => {
        categoryMap.set(cat.id, cat.name);
      });
    }

    // Test reminder logic for each subscription
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const subscriptionsWithReminders =
      subscriptions?.map((sub) => {
        const renewalDate = new Date(sub.renewalDate);
        renewalDate.setHours(0, 0, 0, 0);

        const paidForUser = users?.find((user) => user.id === sub.paidFor);

        // Test each reminder setting
        const reminders = [
          { type: "reminderOne", setting: sub.reminderOne },
          { type: "reminderTwo", setting: sub.reminderTwo },
          { type: "reminderThree", setting: sub.reminderThree },
        ];

        const reminderResults = reminders.map((reminder) => {
          const days = parseReminderDays(reminder.setting);
          const shouldSend =
            days > 0 && shouldSendReminder(sub.renewalDate, days);

          return {
            type: reminder.type,
            setting: reminder.setting,
            days,
            shouldSend,
          };
        });

        return {
          id: sub.id,
          name: sub.nameOfSubscription,
          renewalDate: sub.renewalDate,
          category: categoryMap.get(sub.category) || sub.category,
          paidFor: paidForUser?.email || sub.paidFor,
          reminders: reminderResults,
          daysUntilRenewal: Math.ceil(
            (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          ),
        };
      }) || [];

    return NextResponse.json({
      success: true,
      message: "Subscriptions retrieved successfully",
      currentDate: today.toISOString().split("T")[0],
      totalSubscriptions: subscriptions?.length || 0,
      subscriptions: subscriptionsWithReminders,
    });
  } catch (error) {
    console.error("Error in test subscriptions API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

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

// Helper function to check if reminder should be sent
function shouldSendReminder(
  renewalDate: string,
  reminderDays: number
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renewal = new Date(renewalDate);
  renewal.setHours(0, 0, 0, 0);

  const reminderDate = new Date(renewal);
  reminderDate.setDate(reminderDate.getDate() - reminderDays);

  return (
    today.getFullYear() === reminderDate.getFullYear() &&
    today.getMonth() === reminderDate.getMonth() &&
    today.getDate() === reminderDate.getDate()
  );
}
