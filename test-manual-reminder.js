// Manual test of reminder system
const testManualReminder = async () => {
  console.log("🔍 Manual Reminder Test");
  console.log("=".repeat(50));

  try {
    // Test the reminder API
    const response = await fetch(
      "http://localhost:3000/api/scheduler/subscription-reminders?manual=true"
    );
    const result = await response.json();

    console.log("API Response:", result);

    if (result.success) {
      console.log("✅ Reminder system executed successfully");
    } else {
      console.log("❌ Reminder system failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error calling reminder API:", error.message);
  }
};

// Test SMTP configuration
const testSMTPConfig = async () => {
  console.log("\n🔧 Testing SMTP Configuration");
  console.log("-".repeat(40));

  try {
    const response = await fetch("http://localhost:3000/api/smtp/config");
    const result = await response.json();

    console.log("SMTP Config Response:", result);

    if (result.success && result.config) {
      console.log("✅ SMTP is configured");
      console.log("Provider:", result.config.provider);
      console.log("From Email:", result.config.fromEmail);
    } else {
      console.log("❌ SMTP not configured:", result.error || result.message);
    }
  } catch (error) {
    console.error("❌ Error checking SMTP config:", error.message);
  }
};

// Run tests
const runTests = async () => {
  await testSMTPConfig();
  await testManualReminder();
};

runTests();
