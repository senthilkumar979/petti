#!/usr/bin/env node

/**
 * Test script for subscription reminders
 * This script helps test the reminder system without waiting for the CRON job
 */

import https from "https";
import http from "http";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ENDPOINT = "/api/scheduler/subscription-reminders";

function makeRequest(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https");
    const client = isHttps ? https : http;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = client.request(url, options, (res) => {
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

async function testReminderSystem() {
  console.log("🧪 Testing Subscription Reminder System");
  console.log("=====================================\n");

  try {
    // Test 1: Check if the endpoint is accessible
    console.log("1. Testing endpoint accessibility...");
    const statusUrl = `${BASE_URL}${ENDPOINT}`;
    const statusResponse = await makeRequest(statusUrl);

    if (statusResponse.status === 200) {
      console.log("✅ Endpoint is accessible");
      console.log("Response:", statusResponse.data);
    } else {
      console.log("❌ Endpoint returned status:", statusResponse.status);
      return;
    }

    // Test 2: Manual trigger
    console.log("\n2. Testing manual trigger...");
    const manualUrl = `${BASE_URL}${ENDPOINT}?manual=true`;
    const manualResponse = await makeRequest(manualUrl);

    if (manualResponse.status === 200) {
      console.log("✅ Manual trigger successful");
      console.log("Response:", manualResponse.data);
    } else {
      console.log(
        "❌ Manual trigger failed with status:",
        manualResponse.status
      );
      console.log("Response:", manualResponse.data);
    }

    // Test 3: POST request
    console.log("\n3. Testing POST request...");
    const postResponse = await makeRequest(`${BASE_URL}${ENDPOINT}`, "POST");

    if (postResponse.status === 200) {
      console.log("✅ POST request successful");
      console.log("Response:", postResponse.data);
    } else {
      console.log("❌ POST request failed with status:", postResponse.status);
      console.log("Response:", postResponse.data);
    }

    console.log("\n🎉 All tests completed!");
    console.log("\n📝 Next steps:");
    console.log("1. Check your email for any reminder emails");
    console.log("2. Verify the console logs in your application");
    console.log("3. Check your Resend dashboard for email delivery status");
  } catch (err) {
    console.error("❌ Test failed with error:", err.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure your Next.js application is running");
    console.log("2. Check that the API route is accessible");
    console.log("3. Verify your environment variables are set correctly");
    console.log("4. Check the application logs for any errors");
  }
}

// Run the test
testReminderSystem();
