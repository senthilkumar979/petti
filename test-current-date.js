// Test with current date to see if reminders work
const testCurrentDateReminders = () => {
  console.log("🔍 Testing Reminders with Current Date");
  console.log("=".repeat(50));

  const now = new Date();
  console.log("Current Date/Time:", now.toString());
  console.log("Date only:", now.toISOString().split("T")[0]);

  // Test with today's date and future dates
  const today = now.toISOString().split("T")[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split("T")[0];

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  console.log("\n📅 Testing with current dates:");
  console.log(`Today: ${today}`);
  console.log(`Tomorrow: ${tomorrowStr}`);
  console.log(`Day after tomorrow: ${dayAfterTomorrowStr}`);
  console.log(`Next week: ${nextWeekStr}`);

  const testDates = [
    { date: today, name: "Today" },
    { date: tomorrowStr, name: "Tomorrow" },
    { date: dayAfterTomorrowStr, name: "Day after tomorrow" },
    { date: nextWeekStr, name: "Next week" },
  ];

  console.log("\n🔔 Reminder Logic Test:");
  console.log("-".repeat(40));

  testDates.forEach(({ date, name }) => {
    console.log(`\n${name} (${date}):`);

    const reminderSettings = [
      "1 day before",
      "2 days before",
      "3 days before",
      "1 week before",
    ];

    reminderSettings.forEach((reminderSetting) => {
      const shouldSend = shouldSendReminder(date, reminderSetting);
      console.log(
        `  ${reminderSetting}: ${shouldSend ? "✅ SEND" : "❌ NO SEND"}`
      );
    });
  });

  // Test timezone normalization
  console.log("\n🌍 Timezone Normalization Test:");
  console.log("-".repeat(40));

  const testRenewalDate = tomorrowStr; // Tomorrow
  console.log(`Testing renewal date: ${testRenewalDate}`);

  // Test with different times
  const times = ["00:00:00", "12:00:00", "23:59:59"];

  times.forEach((time) => {
    const testDate = new Date(`${testRenewalDate}T${time}`);
    console.log(`\nTime: ${time}`);
    console.log(`Local: ${testDate.toString()}`);
    console.log(`UTC: ${testDate.toISOString()}`);

    // Normalize to start of day
    const normalized = new Date(testDate);
    normalized.setHours(0, 0, 0, 0);
    console.log(`Normalized: ${normalized.toString()}`);

    const shouldSend = shouldSendReminder(testRenewalDate, "1 day before");
    console.log(`1 day before: ${shouldSend ? "✅ SEND" : "❌ NO SEND"}`);
  });
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

// Helper function to check if reminder should be sent
function shouldSendReminder(renewalDateStr, reminderSetting) {
  const reminderDays = parseReminderDays(reminderSetting);
  if (reminderDays === 0) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const renewal = new Date(renewalDateStr);
  renewal.setHours(0, 0, 0, 0); // Normalize to start of day

  const reminderDate = new Date(renewal);
  reminderDate.setDate(reminderDate.getDate() - reminderDays);

  // Check if today matches the reminder date (within same day)
  const shouldSend =
    today.getFullYear() === reminderDate.getFullYear() &&
    today.getMonth() === reminderDate.getMonth() &&
    today.getDate() === reminderDate.getDate();

  console.log(`    Today: ${today.toDateString()}`);
  console.log(`    Renewal: ${renewal.toDateString()}`);
  console.log(`    Reminder Date: ${reminderDate.toDateString()}`);
  console.log(`    Days before: ${reminderDays}`);

  return shouldSend;
}

// Run the test
testCurrentDateReminders();
