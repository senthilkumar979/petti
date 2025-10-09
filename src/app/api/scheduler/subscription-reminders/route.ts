import { SMTPService } from "@/lib/smtp";
import { loadSMTPConfiguration } from "@/lib/smtp-loader";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface Subscription {
  id: string;
  nameOfSubscription: string;
  periodicity: "Monthly" | "Quarterly" | "Half-yearly" | "Annual" | "Bi-annual";
  amount: number;
  currency: string;
  renewalDate: string;
  reminderOne: string;
  reminderTwo: string;
  reminderThree: string;
  category: string;
  paidFor: string;
  provider?: string;
  note?: string;
  subscription_categories?: {
    name: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
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

// Helper function to check if reminder should be sent today
function shouldSendReminder(
  renewalDate: string,
  reminderDays: number
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  const renewal = new Date(renewalDate);
  renewal.setHours(0, 0, 0, 0); // Normalize to start of day
  
  const reminderDate = new Date(renewal);
  reminderDate.setDate(reminderDate.getDate() - reminderDays);

  console.log(`    Today: ${today.toDateString()}`);
  console.log(`    Renewal: ${renewal.toDateString()}`);
  console.log(`    Reminder Date: ${reminderDate.toDateString()}`);
  console.log(`    Days before: ${reminderDays}`);

  // Check if today matches the reminder date (within same day)
  const shouldSend = (
    today.getFullYear() === reminderDate.getFullYear() &&
    today.getMonth() === reminderDate.getMonth() &&
    today.getDate() === reminderDate.getDate()
  );
  
  console.log(`    Should send: ${shouldSend}`);
  return shouldSend;
}

// Email template for subscription reminders
function createEmailTemplate(
  subscription: Subscription,
  user: User,
  categoryMap: Map<string, string>
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
            <li style="margin: 8px 0;"><strong>Name:</strong> ${
              `<span style="display: inline-block; padding: 4px 8px; background-color: #00b3ee; color: white; border-radius: 4px;">${subscription.nameOfSubscription}</span>`
            }</li>
            <li style="margin: 8px 0;"><strong>Amount:</strong> <span style="display: inline-block; padding: 4px 8px; background-color: #4CAF50; color: white; border-radius: 4px;">${subscription.currency} ${subscription.amount}</span></li>
            </li>
            <li style="margin: 8px 0;"><strong>Renewal Date:</strong>
            <span style="display: inline-block; padding: 4px 8px; background-color: #800080; color: white; border-radius: 4px;">${new Date(subscription.renewalDate).toLocaleDateString()}</span>
            </li>
            <li style="margin: 8px 0;"><strong>Periodicity:</strong>
              <span style="display: inline-block; padding: 4px 8px; background-color: #ff6347; color: white; border-radius: 4px;">${subscription.periodicity}</span>
            </li>
            <li style="margin: 8px 0;"><strong>Category:</strong> ${
              `<span style="display: inline-block; padding: 4px 8px; background-color: #667eea; color: white; border-radius: 4px;">${categoryMap.get(subscription.category) || subscription.category}</span>`
            }</li>
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

// Main function to process subscription reminders
async function processSubscriptionReminders() {
  console.log("🚀 STARTING REMINDER PROCESSING");
  try {
    // Load SMTP configuration
    console.log("🔄 Loading SMTP configuration...");
    const smtpConfig = await loadSMTPConfiguration();
    if (!smtpConfig) {
      console.error("❌ No SMTP configuration found");
      return;
    }
    console.log("✅ SMTP configuration loaded:", smtpConfig.provider);

    const supabaseClient = supabase;

    // Get all active subscriptions
    const { data: subscriptions, error: subscriptionsError } =
      await supabaseClient.from("subscriptions").select("*");

    if (subscriptionsError) {
      console.error("Error fetching subscriptions:", subscriptionsError);
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No subscriptions found");
      return;
    }

    // Get all users for CC purposes
    const { data: users, error: usersError } = await supabaseClient
      .from("users")
      .select("id, email, name");

    // Get all subscription categories for name lookup
    const { data: categories, error: categoriesError } = await supabaseClient
      .from("subscription-categories")
      .select("id, name");

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return;
    }

    // Create category name lookup
    const categoryMap = new Map();
    if (categories) {
      categories.forEach((cat) => {
        categoryMap.set(cat.id, cat.name);
      });
    }

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log("No users found");
      return;
    }

    const remindersToSend: Array<{
      subscription: Subscription;
      user: User;
      reminderType: string;
    }> = [];

    // Process each subscription
    for (const subscription of subscriptions) {
      console.log(
        `Processing subscription: ${subscription.nameOfSubscription} (${subscription.renewalDate})`
      );
      const paidForUser = users.find(
        (user) => user.id === subscription.paidFor
      );
      if (!paidForUser) {
        console.log(`User not found for subscription ${subscription.id}`);
        continue;
      }
      console.log(`Found user: ${paidForUser.email}`);

      // Check reminders against the current renewal date (not next renewal)
      const currentRenewalDate = subscription.renewalDate;

      // Check each reminder setting
      const reminders = [
        {
          type: "reminderOne",
          days: parseReminderDays(subscription.reminderOne),
        },
        {
          type: "reminderTwo",
          days: parseReminderDays(subscription.reminderTwo),
        },
        {
          type: "reminderThree",
          days: parseReminderDays(subscription.reminderThree),
        },
      ];

      for (const reminder of reminders) {
        const shouldSend =
          reminder.days > 0 &&
          shouldSendReminder(currentRenewalDate, reminder.days);
        console.log(
          `  ${reminder.type}: ${reminder.days} days, shouldSend: ${shouldSend}`
        );
        if (shouldSend) {
          console.log(
            `  ✅ Adding reminder for ${subscription.nameOfSubscription}`
          );
          remindersToSend.push({
            subscription,
            user: paidForUser,
            reminderType: reminder.type,
          });
        }
      }
    }

    // Send reminder emails
    for (const reminder of remindersToSend) {
      try {
        const emailHtml = createEmailTemplate(
          reminder.subscription,
          reminder.user,
          categoryMap
        );

        // Get other users for CC (excluding the paidFor user)
        const ccUsers = users
          .filter((user) => user.id !== reminder.subscription.paidFor)
          .map((user) => user.email);

        // Create SMTP service with loaded configuration
        const smtpService = new SMTPService(smtpConfig);

        console.log("📧 Sending email to:", reminder.user.email);

        // Send email using SMTP
        console.log("📤 Attempting to send email...");
        const emailResult = await smtpService.sendEmail({
          to: reminder.user.email,
          cc: ccUsers,
          subject: `🔔 Subscription Reminder: ${reminder.subscription.nameOfSubscription}`,
          html: emailHtml,
        });

        console.log("📧 Email result:", emailResult);

        if (!emailResult.success) {
          console.error(
            `❌ Error sending email for subscription ${reminder.subscription.id}:`,
            emailResult.error
          );
        } else {
          console.log(
            `✅ Reminder email sent successfully for subscription ${reminder.subscription.id} (${reminder.reminderType})`
          );
        }
      } catch (error) {
        console.error(
          `Error processing reminder for subscription ${reminder.subscription.id}:`,
          error
        );
      }
    }

    console.log(
      `📊 Processed ${remindersToSend.length} subscription reminders`
    );
    console.log(
      "📋 Reminders to send:",
      remindersToSend.map((r) => ({
        subscription: r.subscription.nameOfSubscription,
        user: r.user.email,
        type: r.reminderType,
      }))
    );
  } catch (error) {
    console.error("Error in processSubscriptionReminders:", error);
  }
}

// Note: For production, set up a CRON job or scheduled task to call this endpoint daily
// Example: 0 0 * * * curl -X POST http://your-domain.com/api/scheduler/subscription-reminders

export async function GET(request: NextRequest) {
  try {
    // Check if SMTP is configured before processing
    const smtpConfig = await loadSMTPConfiguration();
    if (!smtpConfig) {
      return NextResponse.json(
        {
          success: false,
          error: "SMTP configuration not found",
          message: "Please configure SMTP settings in the Email Settings page before sending reminders.",
        },
        { status: 400 }
      );
    }

    // Manual trigger for testing
    const { searchParams } = new URL(request.url);
    const manual = searchParams.get("manual");

    if (manual === "true") {
      console.log("Manual trigger of subscription reminders...");
      await processSubscriptionReminders();
      return NextResponse.json({
        success: true,
        message: "Subscription reminders processed manually",
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Subscription reminder CRON job is running. Use ?manual=true to trigger manually.",
    });
  } catch (error) {
    console.error("Error in subscription reminders API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process subscription reminders" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Check if SMTP is configured before processing
    const smtpConfig = await loadSMTPConfiguration();
    if (!smtpConfig) {
      return NextResponse.json(
        {
          success: false,
          error: "SMTP configuration not found",
          message: "Please configure SMTP settings in the Email Settings page before sending reminders.",
        },
        { status: 400 }
      );
    }

    await processSubscriptionReminders();
    return NextResponse.json({
      success: true,
      message: "Subscription reminders processed",
    });
  } catch (error) {
    console.error("Error in subscription reminders POST:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process subscription reminders" },
      { status: 500 }
    );
  }
}
