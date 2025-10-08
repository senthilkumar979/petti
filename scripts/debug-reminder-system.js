// Debug the reminder system step by step
console.log("🔍 Debugging Reminder System");
console.log("============================\n");

// Test the parseReminderDays function
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

// Test the shouldSendReminder function
function shouldSendReminder(renewalDate, reminderDays) {
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

// Test with Netflix subscription data
const netflixSubscription = {
  nameOfSubscription: "Netflix",
  renewalDate: "2025-10-10",
  reminderOne: "1 day before",
  reminderTwo: "2 days before",
  reminderThree: "1 week before",
};

console.log("📺 Testing Netflix Subscription:");
console.log(`   Renewal Date: ${netflixSubscription.renewalDate}`);
console.log(`   Reminder One: ${netflixSubscription.reminderOne}`);
console.log(`   Reminder Two: ${netflixSubscription.reminderTwo}`);
console.log(`   Reminder Three: ${netflixSubscription.reminderThree}\n`);

// Test each reminder
const reminders = [
  {
    type: "reminderOne",
    days: parseReminderDays(netflixSubscription.reminderOne),
    setting: netflixSubscription.reminderOne,
  },
  {
    type: "reminderTwo",
    days: parseReminderDays(netflixSubscription.reminderTwo),
    setting: netflixSubscription.reminderTwo,
  },
  {
    type: "reminderThree",
    days: parseReminderDays(netflixSubscription.reminderThree),
    setting: netflixSubscription.reminderThree,
  },
];

console.log("🧪 Testing each reminder:");
reminders.forEach((reminder) => {
  const shouldSend =
    reminder.days > 0 &&
    shouldSendReminder(netflixSubscription.renewalDate, reminder.days);
  console.log(`   ${reminder.type}:`);
  console.log(`     Setting: ${reminder.setting}`);
  console.log(`     Parsed days: ${reminder.days}`);
  console.log(`     Should send: ${shouldSend}`);
  console.log(
    `     Condition: ${reminder.days} > 0 && shouldSendReminder("${netflixSubscription.renewalDate}", ${reminder.days})`
  );
  console.log(
    `     Result: ${reminder.days > 0} && ${shouldSendReminder(netflixSubscription.renewalDate, reminder.days)} = ${shouldSend}\n`
  );
});

console.log("📅 Current date details:");
const today = new Date();
console.log(`   Today: ${today.toISOString().split("T")[0]}`);
console.log(`   Year: ${today.getFullYear()}`);
console.log(`   Month: ${today.getMonth()}`);
console.log(`   Date: ${today.getDate()}`);

console.log("\n📅 Netflix renewal date details:");
const renewal = new Date("2025-10-10");
console.log(`   Renewal: ${renewal.toISOString().split("T")[0]}`);
console.log(`   Year: ${renewal.getFullYear()}`);
console.log(`   Month: ${renewal.getMonth()}`);
console.log(`   Date: ${renewal.getDate()}`);

console.log("\n📅 Reminder date details (2 days before):");
const reminderDate = new Date(renewal);
reminderDate.setDate(reminderDate.getDate() - 2);
console.log(`   Reminder date: ${reminderDate.toISOString().split("T")[0]}`);
console.log(`   Year: ${reminderDate.getFullYear()}`);
console.log(`   Month: ${reminderDate.getMonth()}`);
console.log(`   Date: ${reminderDate.getDate()}`);

console.log("\n🔍 Comparison:");
console.log(
  `   Today year === Reminder year: ${today.getFullYear() === reminderDate.getFullYear()}`
);
console.log(
  `   Today month === Reminder month: ${today.getMonth() === reminderDate.getMonth()}`
);
console.log(
  `   Today date === Reminder date: ${today.getDate() === reminderDate.getDate()}`
);
console.log(
  `   Final result: ${today.getFullYear() === reminderDate.getFullYear() && today.getMonth() === reminderDate.getMonth() && today.getDate() === reminderDate.getDate()}`
);
