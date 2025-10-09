// Test script to debug reminder logic and timezone issues
const testReminderLogic = () => {
  console.log("🔍 Testing Reminder Logic and Timezone Issues");
  console.log("=".repeat(50));

  // Get current date info
  const now = new Date();
  console.log("Current Date/Time:", now.toString());
  console.log("UTC Time:", now.toISOString());
  console.log("Timezone Offset (minutes):", now.getTimezoneOffset());
  console.log(
    "Local Timezone:",
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Test different renewal dates
  const testDates = [
    "2024-12-20", // Today
    "2024-12-21", // Tomorrow
    "2024-12-19", // Yesterday
    "2024-12-22", // Day after tomorrow
  ];

  console.log("\n📅 Testing Reminder Logic:");
  console.log("-".repeat(30));

  testDates.forEach((renewalDateStr) => {
    console.log(`\nTesting renewal date: ${renewalDateStr}`);

    // Test different reminder settings
    const reminderSettings = [
      "1 day before",
      "2 days before",
      "3 days before",
      "1 week before",
    ];

    reminderSettings.forEach((reminderSetting) => {
      const shouldSend = shouldSendReminder(renewalDateStr, reminderSetting);
      console.log(
        `  ${reminderSetting}: ${shouldSend ? "✅ SEND" : "❌ NO SEND"}`
      );
    });
  });

  // Test timezone edge cases
  console.log("\n🌍 Timezone Edge Cases:");
  console.log("-".repeat(30));

  // Test with different times of day
  const times = [
    "00:00:00", // Midnight
    "12:00:00", // Noon
    "23:59:59", // End of day
  ];

  times.forEach((time) => {
    const testDate = new Date(`2024-12-20T${time}`);
    console.log(`\nTime: ${time}`);
    console.log(`Date object: ${testDate.toString()}`);
    console.log(`UTC: ${testDate.toISOString()}`);

    // Test reminder for tomorrow
    const tomorrow = new Date(testDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const shouldSend = shouldSendReminder(tomorrowStr, "1 day before");
    console.log(
      `1 day before tomorrow (${tomorrowStr}): ${
        shouldSend ? "✅ SEND" : "❌ NO SEND"
      }`
    );
  });
};

// Helper function to parse reminder days (same as in the API)
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

// Helper function to check if reminder should be sent (same as in the API)
function shouldSendReminder(renewalDateStr, reminderSetting) {
  const reminderDays = parseReminderDays(reminderSetting);
  if (reminderDays === 0) return false;

  const today = new Date();
  const renewal = new Date(renewalDateStr);
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
testReminderLogic();
