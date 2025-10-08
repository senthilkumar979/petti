import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug: Fetching subscriptions...");

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

    console.log(`📊 Found ${subscriptions?.length || 0} subscriptions`);

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

    console.log(`👥 Found ${users?.length || 0} users`);

    // Debug each subscription
    const debugInfo = {
      totalSubscriptions: subscriptions?.length || 0,
      totalUsers: users?.length || 0,
      subscriptions:
        subscriptions?.map((sub) => ({
          id: sub.id,
          name: sub.nameOfSubscription,
          renewalDate: sub.renewalDate,
          reminderOne: sub.reminderOne,
          reminderTwo: sub.reminderTwo,
          reminderThree: sub.reminderThree,
          paidFor: sub.paidFor,
          periodicity: sub.periodicity,
        })) || [],
      users:
        users?.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        })) || [],
    };

    return NextResponse.json({
      success: true,
      message: "Debug information retrieved",
      debug: debugInfo,
    });
  } catch (error) {
    console.error("Error in debug reminders API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to debug reminders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
