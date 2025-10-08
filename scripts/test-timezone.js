// Test timezone issues
console.log("🌍 Testing Timezone Issues");
console.log("=========================\n");

const today = new Date();
console.log("📅 Current Date/Time:");
console.log(`   Full date: ${today.toISOString()}`);
console.log(`   Date only: ${today.toISOString().split("T")[0]}`);
console.log(`   Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
console.log(`   UTC offset: ${today.getTimezoneOffset()} minutes`);

console.log("\n📅 Netflix renewal date:");
const renewal = new Date("2025-10-10");
console.log(`   Full date: ${renewal.toISOString()}`);
console.log(`   Date only: ${renewal.toISOString().split("T")[0]}`);

console.log("\n📅 Reminder date (2 days before):");
const reminderDate = new Date(renewal);
reminderDate.setDate(reminderDate.getDate() - 2);
console.log(`   Full date: ${reminderDate.toISOString()}`);
console.log(`   Date only: ${reminderDate.toISOString().split("T")[0]}`);

console.log("\n🔍 Date comparison:");
console.log(`   Today: ${today.toISOString().split("T")[0]}`);
console.log(`   Reminder: ${reminderDate.toISOString().split("T")[0]}`);
console.log(
  `   Match: ${today.toISOString().split("T")[0] === reminderDate.toISOString().split("T")[0]}`
);

console.log("\n🔍 Component comparison:");
console.log(
  `   Today year: ${today.getFullYear()}, Reminder year: ${reminderDate.getFullYear()}`
);
console.log(
  `   Today month: ${today.getMonth()}, Reminder month: ${reminderDate.getMonth()}`
);
console.log(
  `   Today date: ${today.getDate()}, Reminder date: ${reminderDate.getDate()}`
);

console.log("\n🧪 Testing different date formats:");
const testDate1 = new Date("2025-10-08");
const testDate2 = new Date("2025-10-08T00:00:00.000Z");
const testDate3 = new Date("2025-10-08T12:00:00.000Z");

console.log(`   Date from string: ${testDate1.toISOString().split("T")[0]}`);
console.log(`   Date with time: ${testDate2.toISOString().split("T")[0]}`);
console.log(`   Date with noon: ${testDate3.toISOString().split("T")[0]}`);

console.log("\n💡 Potential issues:");
console.log("1. Timezone differences between server and client");
console.log("2. Date parsing issues");
console.log("3. Server time vs local time");
console.log("4. Date comparison logic");
