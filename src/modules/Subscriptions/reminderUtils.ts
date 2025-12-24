import { Subscription } from "@/types/database";

interface ReminderDate {
  date: string;
  reminderType: "reminderOne" | "reminderTwo" | "reminderThree" | "renewal";
}

/**
 * Parses a reminder string to days before renewal
 */
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

/**
 * Gets the number of months to add based on periodicity
 */
function getPeriodicityMonths(
  periodicity: Subscription["periodicity"]
): number {
  switch (periodicity) {
    case "Monthly":
      return 1;
    case "Quarterly":
      return 3;
    case "Half-yearly":
      return 6;
    case "Annual":
      return 12;
    case "Bi-annual":
      return 24;
    default:
      return 1;
  }
}

/**
 * Adds months to a date, handling edge cases like month-end dates
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Generates all reminder dates for a subscription from renewalDate to endDate
 * based on periodicity and reminder settings
 */
export function generateReminderDates(
  renewalDate: string,
  endDate: string,
  periodicity: Subscription["periodicity"],
  reminderOne: Subscription["reminderOne"],
  reminderTwo: Subscription["reminderTwo"],
  reminderThree: Subscription["reminderThree"]
): ReminderDate[] {
  const reminders: ReminderDate[] = [];
  const periodicityMonths = getPeriodicityMonths(periodicity);
  const reminderOneDays = parseReminderDays(reminderOne);
  const reminderTwoDays = parseReminderDays(reminderTwo);
  const reminderThreeDays = parseReminderDays(reminderThree);

  const startRenewalDate = new Date(renewalDate);
  const end = new Date(endDate);

  // Normalize dates to start of day
  startRenewalDate.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Start from the next renewal period after the initial renewal date
  let currentRenewalDate = addMonths(startRenewalDate, periodicityMonths);

  // Generate reminders for each renewal period until endDate
  while (currentRenewalDate <= end) {
    // Add reminder three (furthest out)
    if (reminderThreeDays > 0) {
      const reminderThreeDate = new Date(currentRenewalDate);
      reminderThreeDate.setDate(reminderThreeDate.getDate() - reminderThreeDays);
      reminders.push({
        date: reminderThreeDate.toISOString().split("T")[0],
        reminderType: "reminderThree",
      });
    }

    // Add reminder two
    if (reminderTwoDays > 0) {
      const reminderTwoDate = new Date(currentRenewalDate);
      reminderTwoDate.setDate(reminderTwoDate.getDate() - reminderTwoDays);
      reminders.push({
        date: reminderTwoDate.toISOString().split("T")[0],
        reminderType: "reminderTwo",
      });
    }

    // Add reminder one (closest to renewal)
    if (reminderOneDays > 0) {
      const reminderOneDate = new Date(currentRenewalDate);
      reminderOneDate.setDate(reminderOneDate.getDate() - reminderOneDays);
      reminders.push({
        date: reminderOneDate.toISOString().split("T")[0],
        reminderType: "reminderOne",
      });
    }

    // Add the renewal date itself
    reminders.push({
      date: currentRenewalDate.toISOString().split("T")[0],
      reminderType: "renewal",
    });

    // Move to next renewal period
    currentRenewalDate = addMonths(currentRenewalDate, periodicityMonths);
  }

  // Sort by date
  reminders.sort((a, b) => a.date.localeCompare(b.date));

  return reminders;
}

