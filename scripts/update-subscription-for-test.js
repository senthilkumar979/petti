// Update a subscription to test the reminder system
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

console.log("🔄 Updating Subscription for Testing");
console.log("===================================\n");

console.log("📅 Tomorrow's date:", tomorrowStr);

console.log("\n📋 SQL Command to run in Supabase SQL Editor:");
console.log(
  "-- Update one of your subscriptions to have renewal date tomorrow"
);
console.log(
  `UPDATE subscriptions SET "renewalDate" = '${tomorrowStr}' WHERE id = '53dd706e-0ff2-40b9-8d24-f6145cec2a83';`
);

console.log("\n✅ After running this SQL:");
console.log("1. The 'Wifi' subscription will have renewal date tomorrow");
console.log("2. It has '1 day before' reminder setting");
console.log("3. This should trigger a reminder email today");
console.log(
  "4. Test with: curl 'http://localhost:3000/api/scheduler/subscription-reminders?manual=true'"
);

console.log("\n🔍 Expected Result:");
console.log("- Should process 1 subscription reminder");
console.log("- Should send email to: senthilk979@gmail.com");
console.log("- Check your email inbox and spam folder!");
