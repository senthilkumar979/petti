// Test the reminder logic with your actual data
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

console.log("🧪 Testing Reminder Logic");
console.log("========================\n");

console.log("📅 Current Date:", today.toISOString().split("T")[0]);
console.log("📅 Tomorrow:", tomorrow.toISOString().split("T")[0]);

// Your Netflix subscription
const netflixSubscription = {
  name: "Netflix",
  renewalDate: "2025-10-10", // 2 days from now
  reminderOne: "1 day before",
  reminderTwo: "2 days before",
  reminderThree: "1 week before",
};

console.log("\n📺 Netflix Subscription:");
console.log(`   Renewal: ${netflixSubscription.renewalDate}`);
console.log(
  `   Reminders: ${netflixSubscription.reminderOne}, ${netflixSubscription.reminderTwo}, ${netflixSubscription.reminderThree}`
);

// Test reminder logic
function shouldSendReminder(renewalDate, reminderDays) {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const reminderDate = new Date(renewal);
  reminderDate.setDate(reminderDate.getDate() - reminderDays);

  console.log(`\n🔍 Testing reminder logic:`);
  console.log(`   Today: ${today.toISOString().split("T")[0]}`);
  console.log(`   Renewal: ${renewal.toISOString().split("T")[0]}`);
  console.log(
    `   Reminder date (${reminderDays} days before): ${reminderDate.toISOString().split("T")[0]}`
  );

  const shouldSend =
    today.getFullYear() === reminderDate.getFullYear() &&
    today.getMonth() === reminderDate.getMonth() &&
    today.getDate() === reminderDate.getDate();

  console.log(`   Should send: ${shouldSend}`);
  return shouldSend;
}

// Test each reminder setting
console.log("\n🧪 Testing Netflix reminders:");
console.log(
  "1 day before:",
  shouldSendReminder(netflixSubscription.renewalDate, 1)
);
console.log(
  "2 days before:",
  shouldSendReminder(netflixSubscription.renewalDate, 2)
);
console.log(
  "1 week before:",
  shouldSendReminder(netflixSubscription.renewalDate, 7)
);

// Test with a subscription that should trigger today
const testSubscription = {
  name: "Test Subscription",
  renewalDate: tomorrow.toISOString().split("T")[0], // Tomorrow
  reminderOne: "1 day before",
};

console.log("\n🧪 Testing with tomorrow's renewal:");
console.log(
  "1 day before:",
  shouldSendReminder(testSubscription.renewalDate, 1)
);

console.log("\n💡 Solution:");
console.log(
  "To test the reminder system, you need a subscription with renewal date tomorrow (2025-10-09)"
);
console.log(
  "Update one of your subscriptions to have renewal date: 2025-10-09"
);
console.log(
  "Then run: curl 'http://localhost:3000/api/scheduler/subscription-reminders?manual=true'"
);
