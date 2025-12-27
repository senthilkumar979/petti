import { SMTPService } from "@/lib/smtp";
import { loadSMTPConfiguration } from "@/lib/smtp-loader";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface Reminder {
  id: string;
  subscription_id: string;
  reminder_date: string;
  reminder_type: string;
}

interface Subscription {
  id: string;
  nameOfSubscription: string;
  periodicity: string;
  amount: number;
  currency: string;
  renewalDate: string;
  category: string;
  paidFor: string;
  provider?: string;
  note?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

// Email template for subscription reminders
function createEmailTemplate(
  subscription: Subscription,
  user: User,
  categoryName: string
): string {
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
            <li style="margin: 8px 0;"><strong>Name:</strong> 
              <span style="display: inline-block; padding: 4px 8px; background-color: #00b3ee; color: white; border-radius: 4px;">${subscription.nameOfSubscription}</span>
            </li>
            <li style="margin: 8px 0;"><strong>Amount:</strong> 
              <span style="display: inline-block; padding: 4px 8px; background-color: #4CAF50; color: white; border-radius: 4px;">${subscription.currency} ${subscription.amount}</span>
            </li>
            <li style="margin: 8px 0;"><strong>Renewal Date:</strong>
              <span style="display: inline-block; padding: 4px 8px; background-color: #800080; color: white; border-radius: 4px;">${new Date(subscription.renewalDate).toLocaleDateString()}</span>
            </li>
            <li style="margin: 8px 0;"><strong>Periodicity:</strong>
              <span style="display: inline-block; padding: 4px 8px; background-color: #ff6347; color: white; border-radius: 4px;">${subscription.periodicity}</span>
            </li>
            <li style="margin: 8px 0;"><strong>Category:</strong> 
              <span style="display: inline-block; padding: 4px 8px; background-color: #667eea; color: white; border-radius: 4px;">${categoryName}</span>
            </li>
            ${
              subscription.provider
                ? `<li style="margin: 8px 0;"><strong>Provider:</strong> ${subscription.provider}</li>`
                : ""
            }
            ${
              subscription.note
                ? `<li style="margin: 8px 0;"><strong>Note:</strong> ${subscription.note}</li>`
                : ""
            }
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

// Get current date in CET timezone
// CET is UTC+1 in winter, UTC+2 in summer (CEST)
// Since CRON runs at 23:00 UTC, we need to get the date that it will be at 00:00 CET
function getCurrentDateCET(): string {
  const now = new Date();
  
  // Get UTC time
  const utcTime = now.getTime();
  
  // Determine if we're in CEST (summer) or CET (winter)
  // CEST: approximately April-September (UTC+2)
  // CET: approximately October-March (UTC+1)
  const month = now.getUTCMonth() + 1; // 1-12
  const isSummer = month >= 4 && month <= 9; // April to September
  const cetOffset = isSummer ? 2 : 1; // CEST is UTC+2, CET is UTC+1
  
  // Convert to CET/CEST by adding offset hours
  const cetTime = utcTime + cetOffset * 3600000;
  const cetDate = new Date(cetTime);
  
  // Format as YYYY-MM-DD
  const year = cetDate.getUTCFullYear();
  const monthStr = String(cetDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(cetDate.getUTCDate()).padStart(2, "0");
  
  return `${year}-${monthStr}-${day}`;
}

// Main function to process reminders from reminders table
async function processDailyReminders() {
  console.log("🚀 STARTING DAILY REMINDER PROCESSING");
  try {
    // Load SMTP configuration
    console.log("🔄 Loading SMTP configuration...");
    const smtpConfig = await loadSMTPConfiguration();
    if (!smtpConfig) {
      console.error("❌ No SMTP configuration found");
      return { success: false, error: "SMTP configuration not found" };
    }
    console.log("✅ SMTP configuration loaded:", smtpConfig.provider);

    // Get current date in CET
    const todayCET = getCurrentDateCET();
    console.log(`📅 Checking reminders for date: ${todayCET} (CET)`);

    // Fetch reminders where reminder_date matches today (CET)
    const { data: reminders, error: remindersError } = await supabase
      .from("reminders")
      .select("*")
      .eq("reminder_date", todayCET);

    if (remindersError) {
      console.error("❌ Error fetching reminders:", remindersError);
      return { success: false, error: remindersError.message };
    }

    if (!reminders || reminders.length === 0) {
      console.log("ℹ️ No reminders found for today");
      return { success: true, processed: 0, message: "No reminders for today" };
    }

    console.log(`📋 Found ${reminders.length} reminder(s) for today`);

    // Get all users for CC purposes
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, name");

    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
      return { success: false, error: usersError.message };
    }

    if (!users || users.length === 0) {
      console.log("❌ No users found");
      return { success: false, error: "No users found" };
    }

    // Get all subscription categories for name lookup
    const { data: categories, error: categoriesError } = await supabase
      .from("subscription-categories")
      .select("id, name");

    if (categoriesError) {
      console.error("❌ Error fetching categories:", categoriesError);
      return { success: false, error: categoriesError.message };
    }

    // Create category name lookup
    const categoryMap = new Map<string, string>();
    if (categories) {
      categories.forEach((cat) => {
        categoryMap.set(cat.id, cat.name);
      });
    }

    // Process each reminder
    let successCount = 0;
    let errorCount = 0;

    for (const reminder of reminders) {
      try {
        console.log(
          `📧 Processing reminder ${reminder.id} for subscription ${reminder.subscription_id}`
        );

        // Fetch subscription details
        const { data: subscription, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("id", reminder.subscription_id)
          .single();

        if (subscriptionError || !subscription) {
          console.error(
            `❌ Error fetching subscription ${reminder.subscription_id}:`,
            subscriptionError
          );
          errorCount++;
          continue;
        }

        // Find the user who pays for this subscription
        const paidForUser = users.find(
          (user) => user.id === subscription.paidFor
        );

        if (!paidForUser) {
          console.error(
            `❌ User not found for subscription ${subscription.id} (paidFor: ${subscription.paidFor})`
          );
          errorCount++;
          continue;
        }

        // Get category name
        const categoryName =
          categoryMap.get(subscription.category) || subscription.category;

        // Create email template
        const emailHtml = createEmailTemplate(
          subscription as Subscription,
          paidForUser as User,
          categoryName
        );

        // Get other users for CC (excluding the paidFor user)
        const ccUsers = users
          .filter((user) => user.id !== subscription.paidFor)
          .map((user) => user.email);

        // Create SMTP service with loaded configuration
        const smtpService = new SMTPService(smtpConfig);

        console.log(`📤 Sending email to: ${paidForUser.email}`);

        // Send email using SMTP
        const emailResult = await smtpService.sendEmail({
          to: paidForUser.email,
          cc: ccUsers,
          subject: `🔔 Subscription Reminder: ${subscription.nameOfSubscription}`,
          html: emailHtml,
        });

        if (!emailResult.success) {
          console.error(
            `❌ Error sending email for reminder ${reminder.id}:`,
            emailResult.error
          );
          errorCount++;
        } else {
          console.log(
            `✅ Reminder email sent successfully for subscription ${subscription.nameOfSubscription}`
          );
          successCount++;
        }
      } catch (error) {
        console.error(
          `❌ Error processing reminder ${reminder.id}:`,
          error
        );
        errorCount++;
      }
    }

    console.log(
      `📊 Processed ${reminders.length} reminder(s): ${successCount} successful, ${errorCount} failed`
    );

    return {
      success: true,
      processed: reminders.length,
      successful: successCount,
      failed: errorCount,
      message: `Processed ${reminders.length} reminder(s)`,
    };
  } catch (error) {
    console.error("❌ Error in processDailyReminders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// CRON endpoint - called by Vercel Cron at 12 AM CET daily
export async function GET(request: NextRequest) {
  try {
    // Verify this is a CRON request (Vercel adds a special header)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is set, verify the request
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Manual trigger for testing
    const { searchParams } = new URL(request.url);
    const manual = searchParams.get("manual");

    if (manual === "true") {
      console.log("🔧 Manual trigger of daily reminders...");
      const result = await processDailyReminders();
      return NextResponse.json(result);
    }

    // Process reminders
    const result = await processDailyReminders();
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error in daily reminders API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

