import https from "https";
import http from "http";

// Test data for users (matching your users table structure)
const testUsers = [
  {
    id: "test-user-1",
    email: "your-email@example.com", // Replace with your actual email
    name: "Test User 1",
    picture: null,
    addedOn: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    addedBy: null,
    updatedBy: null,
  },
  {
    id: "test-user-2",
    email: "your-email2@example.com", // Replace with another email
    name: "Test User 2",
    picture: null,
    addedOn: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    addedBy: null,
    updatedBy: null,
  },
];

// Test data for subscriptions (matching your subscriptions table structure)
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
    lastModified: new Date().toISOString(),
    modifiedBy: "test-user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    lastModified: new Date().toISOString(),
    modifiedBy: "test-user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    nameOfSubscription: "Adobe Creative Cloud",
    periodicity: "Annual",
    amount: 599.88,
    currency: "USD",
    renewalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 3 days from now
    reminderOne: "1 week before",
    reminderTwo: "10 days before",
    reminderThree: "1 day before",
    category: "Software",
    paidFor: "test-user-2",
    provider: "Adobe",
    note: "Full suite for design work",
    lastModified: new Date().toISOString(),
    modifiedBy: "test-user-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

console.log("🧪 Adding Test Data to Your Database");
console.log("=====================================\n");

console.log("📝 Test Subscriptions:");
testSubscriptions.forEach((sub, index) => {
  console.log(
    `${index + 1}. ${sub.nameOfSubscription} - $${sub.amount} ${sub.currency}`
  );
  console.log(`   Renewal: ${sub.renewalDate}`);
  console.log(
    `   Reminders: ${sub.reminderOne}, ${sub.reminderTwo}, ${sub.reminderThree}`
  );
  console.log(`   Paid For: ${sub.paidFor}\n`);
});

console.log("👥 Test Users:");
testUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.name} (${user.email})`);
});

console.log("\n⚠️  IMPORTANT:");
console.log(
  "1. Replace 'your-email@example.com' with your actual email address"
);
console.log(
  "2. Make sure your Supabase database has the correct table structure"
);
console.log(
  "3. Add this data manually to your database or use Supabase dashboard"
);

console.log("\n📋 SQL Commands to run in Supabase SQL Editor:");
console.log("\n-- Insert test users");
testUsers.forEach((user) => {
  console.log(
    `INSERT INTO users (id, email, name, picture, "addedOn", "lastUpdated", "addedBy", "updatedBy") VALUES ('${user.id}', '${user.email}', '${user.name}', ${user.picture ? `'${user.picture}'` : "NULL"}, '${user.addedOn}', '${user.lastUpdated}', ${user.addedBy ? `'${user.addedBy}'` : "NULL"}, ${user.updatedBy ? `'${user.updatedBy}'` : "NULL"});`
  );
});

console.log("\n-- Insert test subscriptions");
testSubscriptions.forEach((sub) => {
  console.log(
    `INSERT INTO subscriptions ("nameOfSubscription", periodicity, amount, currency, "renewalDate", "reminderOne", "reminderTwo", "reminderThree", category, "paidFor", provider, note, "lastModified", "modifiedBy", "createdAt", "updatedAt") VALUES ('${sub.nameOfSubscription}', '${sub.periodicity}', ${sub.amount}, '${sub.currency}', '${sub.renewalDate}', '${sub.reminderOne}', '${sub.reminderTwo}', '${sub.reminderThree}', '${sub.category}', '${sub.paidFor}', '${sub.provider}', '${sub.note}', '${sub.lastModified}', '${sub.modifiedBy}', '${sub.createdAt}', '${sub.updatedAt}');`
  );
});

console.log("\n✅ After adding this data, test the reminder system:");
console.log(
  "curl 'http://localhost:3000/api/scheduler/subscription-reminders?manual=true'"
);

console.log("\n📧 Expected Results:");
console.log(
  "- Netflix reminder should be sent (renewal tomorrow, 1 day before reminder)"
);
console.log(
  "- Spotify reminder should be sent (renewal day after tomorrow, 1 day before reminder)"
);
console.log(
  "- Adobe reminder should be sent (renewal in 3 days, 1 week before reminder)"
);
console.log("- Check your email inbox and spam folder!");
