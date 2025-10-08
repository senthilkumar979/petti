import https from "https";
import http from "http";

// Test data for subscriptions
const testSubscriptions = [
  {
    nameOfSubscription: "Netflix Premium",
    periodicity: "Monthly",
    amount: 15.99,
    currency: "USD",
    renewalDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Tomorrow
    reminderOne: "1 day before",
    reminderTwo: "1 week before",
    reminderThree: "10 days before",
    category: "Entertainment",
    paidFor: "test-user-1",
    provider: "Netflix",
    note: "Family plan for 4 screens",
  },
  {
    nameOfSubscription: "Spotify Premium",
    periodicity: "Monthly",
    amount: 9.99,
    currency: "USD",
    renewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Day after tomorrow
    reminderOne: "1 day before",
    reminderTwo: "3 days before",
    reminderThree: "1 week before",
    category: "Music",
    paidFor: "test-user-1",
    provider: "Spotify",
    note: "Student discount",
  },
];

// Test data for users
const testUsers = [
  {
    id: "test-user-1",
    email: "test@example.com", // Replace with your email
    name: "Test User",
  },
  {
    id: "test-user-2",
    email: "test2@example.com", // Replace with another email
    name: "Test User 2",
  },
];

console.log("🧪 Adding Test Data to Database");
console.log("=====================================\n");

console.log("📝 Test Subscriptions:");
testSubscriptions.forEach((sub, index) => {
  console.log(
    `${index + 1}. ${sub.nameOfSubscription} - $${sub.amount} ${sub.currency}`
  );
  console.log(`   Renewal: ${sub.renewalDate}`);
  console.log(
    `   Reminders: ${sub.reminderOne}, ${sub.reminderTwo}, ${sub.reminderThree}\n`
  );
});

console.log("👥 Test Users:");
testUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.name} (${user.email})`);
});

console.log("\n⚠️  IMPORTANT:");
console.log("1. Replace test@example.com with your actual email address");
console.log(
  "2. Make sure your Supabase database has 'subscriptions' and 'users' tables"
);
console.log(
  "3. Add this data manually to your database or use Supabase dashboard"
);
console.log("\n📋 SQL Commands to run in Supabase SQL Editor:");
console.log("\n-- Insert test users");
testUsers.forEach((user) => {
  console.log(
    `INSERT INTO users (id, email, name) VALUES ('${user.id}', '${user.email}', '${user.name}');`
  );
});

console.log("\n-- Insert test subscriptions");
testSubscriptions.forEach((sub) => {
  console.log(
    `INSERT INTO subscriptions (nameOfSubscription, periodicity, amount, currency, renewalDate, reminderOne, reminderTwo, reminderThree, category, paidFor, provider, note) VALUES ('${sub.nameOfSubscription}', '${sub.periodicity}', ${sub.amount}, '${sub.currency}', '${sub.renewalDate}', '${sub.reminderOne}', '${sub.reminderTwo}', '${sub.reminderThree}', '${sub.category}', '${sub.paidFor}', '${sub.provider}', '${sub.note}');`
  );
});

console.log("\n✅ After adding this data, test the reminder system:");
console.log(
  "curl 'http://localhost:3000/api/scheduler/subscription-reminders?manual=true'"
);
