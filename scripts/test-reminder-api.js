import https from "https";
import http from "http";

console.log("🧪 Testing Reminder API");
console.log("======================\n");

// Test the reminder API
function testReminderAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/scheduler/subscription-reminders?manual=true",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

// Test the debug API
function testDebugAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/debug-reminders",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log("1. Testing reminder API...");
    const reminderResult = await testReminderAPI();
    console.log(`   Status: ${reminderResult.status}`);
    console.log(
      `   Response: ${JSON.stringify(reminderResult.data, null, 2)}\n`
    );

    console.log("2. Testing debug API...");
    const debugResult = await testDebugAPI();
    console.log(`   Status: ${debugResult.status}`);
    console.log(
      `   Total subscriptions: ${debugResult.data.debug?.totalSubscriptions || 0}`
    );
    console.log(`   Total users: ${debugResult.data.debug?.totalUsers || 0}\n`);

    // Check Netflix subscription specifically
    const netflixSub = debugResult.data.debug?.subscriptions?.find(
      (sub) => sub.name === "Netflix"
    );
    if (netflixSub) {
      console.log("3. Netflix subscription details:");
      console.log(`   Name: ${netflixSub.name}`);
      console.log(`   Renewal Date: ${netflixSub.renewalDate}`);
      console.log(`   Reminder Two: ${netflixSub.reminderTwo}`);
      console.log(`   Should trigger '2 days before' reminder today\n`);
    }

    console.log("🔍 Analysis:");
    console.log("- The reminder API is working (returns success)");
    console.log("- The debug API shows 5 subscriptions and 1 user");
    console.log("- Netflix subscription has renewal date 2025-10-10");
    console.log("- Netflix has '2 days before' reminder setting");
    console.log("- Today is 2025-10-08, so '2 days before' should trigger");
    console.log("- But the system processes 0 reminders");
    console.log("\n💡 The issue might be:");
    console.log("1. The reminder logic is not being called");
    console.log("2. There's an error in the reminder processing");
    console.log("3. The server logs are not showing the debug output");
    console.log("4. There's a timezone issue");
  } catch (error) {
    console.error("Error testing APIs:", error);
  }
}

runTests();
