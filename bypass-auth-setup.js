// Bypass Supabase auth for first user setup
// This creates a user directly in the database without going through Supabase auth

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createFirstUserDirectly() {
  try {
    console.log("🔧 Creating first user directly in database...");

    const userData = {
      id: "admin-user-" + Date.now(),
      email: "admin@example.com",
      name: "Admin User",
      picture: null,
      addedOn: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      addedBy: null,
      updatedBy: null,
    };

    console.log("User data:", userData);

    const { data, error } = await supabase
      .from("users")
      .insert(userData)
      .select();

    if (error) {
      console.error("❌ Error:", error);
    } else {
      console.log("✅ First user created successfully:", data);
      console.log("🎉 You can now access the application!");
    }
  } catch (err) {
    console.error("💥 Unexpected error:", err);
  }
}

createFirstUserDirectly();
