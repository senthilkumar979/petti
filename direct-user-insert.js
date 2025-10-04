// Direct user insert script to test database connection
// Run this with: node direct-user-insert.js

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing environment variables!");
  console.log(
    "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDirectInsert() {
  try {
    console.log("🔍 Testing direct user insert...");
    console.log("Supabase URL:", supabaseUrl);
    console.log("Anon Key:", supabaseAnonKey.substring(0, 20) + "...");

    // Test data
    const testUser = {
      id: "test-direct-insert-123",
      email: "test-direct@example.com",
      name: "Test Direct User",
      picture: null,
      addedOn: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      addedBy: null,
      updatedBy: null,
    };

    console.log("Inserting test user:", testUser);

    const { data, error } = await supabase
      .from("users")
      .insert(testUser)
      .select();

    if (error) {
      console.error("❌ Insert failed:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
    } else {
      console.log("✅ Insert successful:", data);

      // Clean up
      await supabase.from("users").delete().eq("id", "test-direct-insert-123");
      console.log("🧹 Test data cleaned up");
    }
  } catch (err) {
    console.error("💥 Unexpected error:", err);
  }
}

testDirectInsert();
