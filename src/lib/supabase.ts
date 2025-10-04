import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Create a mock client for development when env vars are not set
const createMockClient = () => {
  return {
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () =>
        Promise.resolve({
          data: { user: null },
          error: { message: "Supabase not configured" },
        }),
      signInWithPassword: () =>
        Promise.resolve({
          data: { user: null },
          error: { message: "Supabase not configured" },
        }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({
        data: null,
        error: { message: "Supabase not configured" },
      }),
      update: () => ({
        data: null,
        error: { message: "Supabase not configured" },
      }),
      delete: () => ({
        data: null,
        error: { message: "Supabase not configured" },
      }),
    }),
    storage: {
      from: () => ({
        upload: () => ({
          data: null,
          error: { message: "Supabase not configured" },
        }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
};

export const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (createMockClient() as unknown as ReturnType<typeof createClient>);
