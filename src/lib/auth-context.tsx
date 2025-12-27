"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import {
  User,
  Subscription,
  SubscriptionCategory,
  SubscriptionInsert,
  SubscriptionUpdate,
  Contact,
  ContactInsert,
  ContactUpdate,
  Note,
  NoteInsert,
  NoteUpdate,
  NoteCategory,
  NoteCategoryInsert,
  NoteCategoryUpdate,
  Document,
  DocumentInsert,
  DocumentUpdate,
  DocumentCategory,
  DocumentCategoryInsert,
  DocumentCategoryUpdate,
} from "@/types/database";

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  allUsers: User[] | null; // Cached users list
  allUsersLoading: boolean; // Loading state for users
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  createUserProfile: (
    userData: Omit<User, "id" | "addedOn" | "lastUpdated">
  ) => Promise<{ error: unknown }>;
  createFirstUserProfile: (
    userData: Omit<User, "id" | "addedOn" | "lastUpdated">
  ) => Promise<{ error: unknown }>;
  fetchUserProfile: (
    userId: string
  ) => Promise<{ data: User | null; error: unknown }>;
  updateUser: (
    userId: string,
    userData: { name?: string; picture?: string | null }
  ) => Promise<{ error: unknown }>;
  fetchAllUsers: () => Promise<{ data: User[] | null; error: unknown }>;
  // Subscription management functions
  fetchSubscriptions: () => Promise<{
    data: Subscription[] | null;
    error: unknown;
  }>;
  createSubscription: (
    subscriptionData: SubscriptionInsert
  ) => Promise<{ data: Subscription | null; error: unknown }>;
  updateSubscription: (
    id: string,
    subscriptionData: SubscriptionUpdate
  ) => Promise<{ data: Subscription | null; error: unknown }>;
  deleteSubscription: (id: string) => Promise<{ error: unknown }>;
  fetchSubscriptionCategories: () => Promise<{
    data: SubscriptionCategory[] | null;
    error: unknown;
  }>;
  fetchRenewalReminders: () => Promise<{
    data: Array<{
      id: string;
      subscription_id: string;
      reminder_date: string;
      subscription_name: string;
    }> | null;
    error: unknown;
  }>;
  // Contact management functions
  fetchContacts: () => Promise<{
    data: Contact[] | null;
    error: unknown;
  }>;
  createContact: (
    contactData: ContactInsert
  ) => Promise<{ data: Contact | null; error: unknown }>;
  updateContact: (
    id: string,
    contactData: ContactUpdate
  ) => Promise<{ data: Contact | null; error: unknown }>;
  deleteContact: (id: string) => Promise<{ error: unknown }>;
  // Note management functions
  fetchNotes: () => Promise<{
    data: Note[] | null;
    error: unknown;
  }>;
  createNote: (
    noteData: NoteInsert
  ) => Promise<{ data: Note | null; error: unknown }>;
  updateNote: (
    id: string,
    noteData: NoteUpdate
  ) => Promise<{ data: Note | null; error: unknown }>;
  deleteNote: (id: string) => Promise<{ error: unknown }>;
  // Note category management functions
  fetchNoteCategories: () => Promise<{
    data: NoteCategory[] | null;
    error: unknown;
  }>;
  createNoteCategory: (
    categoryData: NoteCategoryInsert
  ) => Promise<{ data: NoteCategory | null; error: unknown }>;
  updateNoteCategory: (
    id: string,
    categoryData: NoteCategoryUpdate
  ) => Promise<{ data: NoteCategory | null; error: unknown }>;
  deleteNoteCategory: (id: string) => Promise<{ error: unknown }>;
  // Document management functions
  fetchDocuments: () => Promise<{
    data: Document[] | null;
    error: unknown;
  }>;
  createDocument: (
    documentData: DocumentInsert
  ) => Promise<{ data: Document | null; error: unknown }>;
  updateDocument: (
    id: string,
    documentData: DocumentUpdate
  ) => Promise<{ data: Document | null; error: unknown }>;
  deleteDocument: (id: string) => Promise<{ error: unknown }>;
  // Document category management functions
  fetchDocumentCategories: () => Promise<{
    data: DocumentCategory[] | null;
    error: unknown;
  }>;
  createDocumentCategory: (
    categoryData: DocumentCategoryInsert
  ) => Promise<{ data: DocumentCategory | null; error: unknown }>;
  updateDocumentCategory: (
    id: string,
    categoryData: DocumentCategoryUpdate
  ) => Promise<{ data: DocumentCategory | null; error: unknown }>;
  deleteDocumentCategory: (id: string) => Promise<{ error: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  console.log("🔍 useAuth: Hook called");
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("❌ useAuth: No context found - not within AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log("✅ useAuth: Context found", {
    user: !!context.user,
    loading: context.loading,
  });
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log("🚀 AuthProvider: Initializing authentication context");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const fetchAllUsersPromiseRef = useRef<Promise<{
    data: User[] | null;
    error: unknown;
  }> | null>(null);

  // Reset loading state on mount to prevent stale loading states
  useEffect(() => {
    setLoading(true);
  }, []);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return { data: null, error };
      }

      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return { data: null, error };
    }
  }, []);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("🔍 Getting initial session...");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("🔍 Initial session:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id?.substring(0, 10),
        });
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 second timeout

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth State Change:", {
        event,
        user: !!session?.user,
        sessionId: session?.access_token?.substring(0, 10),
      });
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          await fetchUserProfile(session.user.id);
        } catch (error) {
          console.error("Error fetching user profile on auth change:", error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Get initial session
    getInitialSession();

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const updateUser = async (
    userId: string,
    userData: { name?: string; picture?: string | null }
  ) => {
    try {
      const now = new Date().toISOString();
      const updateData = {
        ...userData,
        lastUpdated: now,
        updatedBy: user?.id || null,
      };

      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId);

      if (error) {
        console.error("Error updating user:", error);
        return { error };
      }

      // Refresh the user profile after update
      await fetchUserProfile(userId);

      // Invalidate users cache
      setAllUsers(null);

      return { error: null };
    } catch (error) {
      console.error("Error updating user:", error);
      return { error };
    }
  };

  const fetchAllUsers = useCallback(async () => {
    // Return cached data if available and not loading
    if (allUsers !== null && !allUsersLoading) {
      console.log("👥 fetchAllUsers: Returning cached data", {
        count: allUsers.length,
      });
      return { data: allUsers, error: null };
    }

    // If a request is already in progress, return the existing promise
    if (fetchAllUsersPromiseRef.current) {
      console.log("👥 fetchAllUsers: Reusing existing request");
      return fetchAllUsersPromiseRef.current;
    }

    // Create the request promise
    const requestPromise = (async () => {
      try {
        setAllUsersLoading(true);
        console.log("👥 fetchAllUsers: Starting to fetch users from Supabase");

        // Check if Supabase is properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        console.log("👥 fetchAllUsers: Configuration check", {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlPreview: supabaseUrl?.substring(0, 30) + "...",
          isMock: !supabaseUrl || !supabaseKey,
        });

        if (!supabaseUrl || !supabaseKey) {
          console.warn(
            "👥 fetchAllUsers: Supabase not configured, using mock data"
          );
          return { data: [], error: null };
        }

        const startTime = Date.now();
        console.log(
          "👥 fetchAllUsers: Executing Supabase query at",
          new Date().toISOString()
        );

        // Create a timeout promise with a unique marker
        const TIMEOUT_MARKER = Symbol("TIMEOUT");
        const timeoutDuration = 30000; // 30 seconds
        const timeoutPromise = new Promise<{
          data: null;
          error: Error;
          [TIMEOUT_MARKER]: true;
        }>((resolve) => {
          setTimeout(() => {
            console.error(
              `👥 fetchAllUsers: TIMEOUT after ${
                timeoutDuration / 1000
              } seconds`
            );
            resolve({
              data: null,
              error: new Error(
                `Request timeout after ${timeoutDuration / 1000} seconds`
              ),
              [TIMEOUT_MARKER]: true as const,
            });
          }, timeoutDuration);
        });

        // Execute the query with a limit to reduce data transfer
        // This helps if the table is large or connection is slow
        const queryPromise = supabase
          .from("users")
          .select("*")
          .order("addedOn", { ascending: false })
          .limit(1000); // Add reasonable limit to prevent huge queries

        console.log("👥 fetchAllUsers: Racing query against timeout...");
        const result = await Promise.race([queryPromise, timeoutPromise]);

        // Check if we got a timeout result using the marker
        if (TIMEOUT_MARKER in result && result[TIMEOUT_MARKER]) {
          console.error("👥 fetchAllUsers: Timeout occurred");
          const timeoutError = new Error(
            "Request timeout after 30 seconds: Unable to connect to Supabase. Please check:\n" +
              "1. Your internet connection\n" +
              "2. Supabase project status at https://supabase.com/dashboard\n" +
              "3. Your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
          );
          return { data: null, error: timeoutError };
        }

        // It's a query result
        const { data, error } = result as Awaited<typeof queryPromise>;

        const duration = Date.now() - startTime;
        console.log("👥 fetchAllUsers: Query completed", {
          duration: `${duration}ms`,
          hasError: !!error,
          dataCount: data?.length || 0,
          errorMessage: error
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
          errorCode:
            error && typeof error === "object" && "code" in error
              ? error.code
              : undefined,
        });

        if (error) {
          console.error("👥 fetchAllUsers: Error fetching users", {
            error,
            errorType: typeof error,
            errorKeys:
              error && typeof error === "object" ? Object.keys(error) : [],
          });
          return { data: null, error };
        }

        console.log("👥 fetchAllUsers: Successfully fetched users", {
          count: data?.length || 0,
        });

        // Cache the result
        if (data) {
          setAllUsers(data);
        }

        return { data, error: null };
      } catch (error) {
        console.error("👥 fetchAllUsers: Exception caught", {
          error,
          errorType: typeof error,
          errorMessage: error instanceof Error ? error.message : String(error),
        });
        return { data: null, error };
      } finally {
        // Clear the ref and loading state when the request completes
        fetchAllUsersPromiseRef.current = null;
        setAllUsersLoading(false);
      }
    })();

    // Store the promise in the ref
    fetchAllUsersPromiseRef.current = requestPromise;
    return requestPromise;
  }, [allUsers, allUsersLoading]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("🔐 Sign in result:", {
        success: !error,
        user: !!data?.user,
        session: !!data?.session,
        error: error?.message,
      });

      return { error };
    } catch (error) {
      console.log("🔐 Sign in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const createUserProfile = async (
    userData: Omit<User, "id" | "addedOn" | "lastUpdated">
  ) => {
    try {
      console.log("Creating user profile for:", userData.email);

      // Get the current user's ID
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();

      console.log("Auth check result:", {
        currentUser: !!currentUser,
        authError,
      });

      if (authError) {
        console.error("Auth error:", authError);
        return { error: authError };
      }

      if (!currentUser) {
        console.log("No authenticated user found");
        return {
          error: new Error(
            "No authenticated user found. Please try signing up again."
          ),
        };
      }

      console.log("Creating profile for user ID:", currentUser.id);

      const now = new Date().toISOString();
      const insertData = {
        id: currentUser.id,
        ...userData,
        addedOn: now,
        lastUpdated: now,
      };

      console.log("Inserting data:", insertData);

      // Try to create the user profile directly
      const { data, error } = await supabase
        .from("users")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Database error creating user profile:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });

        // If it's an RLS error, provide a helpful message
        if (
          error.message.includes("row-level security") ||
          error.message.includes("RLS")
        ) {
          return {
            error: new Error(
              "Row Level Security is blocking user creation. Please run the SQL script to disable RLS temporarily, create your first user, then re-enable RLS."
            ),
          };
        }

        return { error };
      }

      console.log("User profile created successfully:", data);

      // Invalidate users cache
      setAllUsers(null);

      return { error: null };
    } catch (error) {
      console.error("Unexpected error creating user profile:", error);
      return { error };
    }
  };

  // Alternative function for first user creation (bypasses auth check)
  const createFirstUserProfile = async (
    userData: Omit<User, "id" | "addedOn" | "lastUpdated">
  ) => {
    try {
      console.log("Creating first user profile for:", userData.email);

      // Generate a random ID for the first user
      const userId = `first-user-${Date.now()}`;

      const now = new Date().toISOString();
      const insertData = {
        id: userId,
        ...userData,
        addedOn: now,
        lastUpdated: now,
      };

      console.log("Inserting first user data:", insertData);

      // Try to create the user profile directly
      const { data, error } = await supabase
        .from("users")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Database error creating first user profile:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });

        return { error };
      }

      console.log("First user profile created successfully:", data);

      // Invalidate users cache
      setAllUsers(null);

      return { error: null };
    } catch (error) {
      console.error("Unexpected error creating first user profile:", error);
      return { error };
    }
  };

  // Subscription management functions
  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Error fetching subscriptions:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return { data: null, error };
    }
  };

  const createSubscription = async (subscriptionData: SubscriptionInsert) => {
    try {
      const now = new Date().toISOString();
      const insertData = {
        ...subscriptionData,
        lastModified: now,
        modifiedBy: user?.id || "",
        createdAt: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("subscriptions")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating subscription:", error);
        return { data: null, error };
      }

      // Generate and insert reminder entries if endDate is provided
      const hasValidEndDate =
        subscriptionData.endDate && subscriptionData.endDate.trim() !== "";

      console.log("🔍 Checking if reminders should be created...", {
        hasData: !!data,
        hasEndDate: !!subscriptionData.endDate,
        hasValidEndDate,
        endDate: subscriptionData.endDate,
        subscriptionId: data?.id,
      });

      if (data && hasValidEndDate && subscriptionData.endDate) {
        try {
          console.log(
            "✅ EndDate provided, proceeding with reminder creation..."
          );

          // Check if reminders table exists by attempting a simple query
          const { error: tableCheckError } = await supabase
            .from("reminders")
            .select("id")
            .limit(0);

          if (tableCheckError) {
            console.warn(
              "⚠️ Reminders table not found. Please run the migration script first.",
              tableCheckError
            );
            // Continue without creating reminders - subscription is already created
          } else {
            console.log(
              "✅ Reminders table exists, generating reminder dates..."
            );

            const { generateReminderDates } = await import(
              "@/modules/Subscriptions/reminderUtils"
            );

            console.log("📅 Generating reminders with:", {
              renewalDate: subscriptionData.renewalDate,
              endDate: subscriptionData.endDate,
              periodicity: subscriptionData.periodicity,
              reminderOne: subscriptionData.reminderOne,
              reminderTwo: subscriptionData.reminderTwo,
              reminderThree: subscriptionData.reminderThree,
            });

            const reminderDates = generateReminderDates(
              subscriptionData.renewalDate,
              subscriptionData.endDate,
              subscriptionData.periodicity,
              subscriptionData.reminderOne,
              subscriptionData.reminderTwo,
              subscriptionData.reminderThree
            );

            console.log(`📊 Generated ${reminderDates.length} reminder dates`);

            if (reminderDates.length > 0) {
              console.log(
                "📋 First 5 reminder dates:",
                reminderDates.slice(0, 5)
              );
            }

            if (reminderDates.length > 0) {
              const reminderInserts = reminderDates.map((reminder) => ({
                subscription_id: data.id,
                reminder_date: reminder.date,
                reminder_type: reminder.reminderType,
                created_at: now,
                updated_at: now,
              }));

              console.log("💾 Inserting reminders into database...", {
                count: reminderInserts.length,
                firstFew: reminderInserts.slice(0, 5),
                subscriptionId: data.id,
              });

              const { data: insertedReminders, error: remindersError } =
                await supabase
                  .from("reminders")
                  .insert(reminderInserts)
                  .select();

              if (remindersError) {
                console.error("❌ Error creating reminders:", remindersError);
                // Don't fail the subscription creation if reminders fail
              } else {
                console.log(
                  `✅ Successfully created ${
                    insertedReminders?.length || reminderDates.length
                  } reminder entries for subscription ${data.id}`
                );
              }
            } else {
              console.warn(
                "⚠️ No reminder dates generated. Check your dates and periodicity settings."
              );
            }
          }
        } catch (reminderError) {
          console.error("❌ Error generating reminders:", reminderError);
          // Don't fail the subscription creation if reminder generation fails
        }
      } else {
        console.log("ℹ️ Skipping reminder creation:", {
          reason: !data ? "No subscription data" : "No endDate provided",
          endDate: subscriptionData.endDate,
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error creating subscription:", error);
      return { data: null, error };
    }
  };

  const updateSubscription = async (
    id: string,
    subscriptionData: SubscriptionUpdate
  ) => {
    try {
      // First, fetch the existing subscription to compare renewalDate
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select(
          "renewalDate, endDate, periodicity, reminderOne, reminderTwo, reminderThree"
        )
        .eq("id", id)
        .single();

      const now = new Date().toISOString();
      const updateData = {
        ...subscriptionData,
        lastModified: now,
        modifiedBy: user?.id || "",
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating subscription:", error);
        return { data: null, error };
      }

      // Check if renewalDate has changed
      const renewalDateChanged =
        subscriptionData.renewalDate &&
        existingSubscription?.renewalDate !== subscriptionData.renewalDate;

      console.log("🔍 Checking if reminders need to be regenerated...", {
        renewalDateChanged,
        oldRenewalDate: existingSubscription?.renewalDate,
        newRenewalDate: subscriptionData.renewalDate,
        hasEndDate:
          !!subscriptionData.endDate || !!existingSubscription?.endDate,
      });

      // Regenerate reminders if renewalDate changed and endDate exists
      if (
        renewalDateChanged &&
        (subscriptionData.endDate || existingSubscription?.endDate)
      ) {
        try {
          // Check if reminders table exists by attempting a simple query
          const { error: tableCheckError } = await supabase
            .from("reminders")
            .select("id")
            .limit(0);

          if (tableCheckError) {
            console.warn(
              "⚠️ Reminders table not found. Please run the migration script first.",
              tableCheckError
            );
            // Continue without updating reminders - subscription is already updated
          } else {
            console.log("🗑️ Deleting existing reminders for subscription:", id);

            // Delete existing reminders for this subscription
            const { error: deleteError } = await supabase
              .from("reminders")
              .delete()
              .eq("subscription_id", id);

            if (deleteError) {
              console.error(
                "❌ Error deleting existing reminders:",
                deleteError
              );
            } else {
              console.log("✅ Successfully deleted existing reminders");
            }

            // Generate and insert new reminder entries
            const { generateReminderDates } = await import(
              "@/modules/Subscriptions/reminderUtils"
            );

            const renewalDate =
              subscriptionData.renewalDate || data.renewalDate;
            const endDate =
              subscriptionData.endDate ||
              existingSubscription?.endDate ||
              data.endDate;
            const periodicity =
              subscriptionData.periodicity || data.periodicity;
            const reminderOne =
              subscriptionData.reminderOne || data.reminderOne;
            const reminderTwo =
              subscriptionData.reminderTwo || data.reminderTwo;
            const reminderThree =
              subscriptionData.reminderThree || data.reminderThree;

            if (!endDate) {
              console.warn(
                "⚠️ No endDate available, skipping reminder generation"
              );
            } else {
              console.log("📅 Generating new reminders with:", {
                renewalDate,
                endDate,
                periodicity,
                reminderOne,
                reminderTwo,
                reminderThree,
              });

              const reminderDates = generateReminderDates(
                renewalDate,
                endDate,
                periodicity,
                reminderOne,
                reminderTwo,
                reminderThree
              );

              console.log(
                `📊 Generated ${reminderDates.length} reminder dates`
              );

              if (reminderDates.length > 0) {
                const reminderInserts = reminderDates.map((reminder) => ({
                  subscription_id: id,
                  reminder_date: reminder.date,
                  reminder_type: reminder.reminderType,
                  created_at: now,
                  updated_at: now,
                }));

                console.log("💾 Inserting new reminders into database...", {
                  count: reminderInserts.length,
                  firstFew: reminderInserts.slice(0, 5),
                });

                const { data: insertedReminders, error: remindersError } =
                  await supabase
                    .from("reminders")
                    .insert(reminderInserts)
                    .select();

                if (remindersError) {
                  console.error("❌ Error updating reminders:", remindersError);
                  // Don't fail the subscription update if reminders fail
                } else {
                  console.log(
                    `✅ Successfully created ${
                      insertedReminders?.length || reminderDates.length
                    } reminder entries for subscription ${id}`
                  );
                }
              } else {
                console.warn(
                  "⚠️ No reminder dates generated. Check your dates and periodicity settings."
                );
              }
            }
          }
        } catch (reminderError) {
          console.error("❌ Error generating reminders:", reminderError);
          // Don't fail the subscription update if reminder generation fails
        }
      } else {
        console.log("ℹ️ Skipping reminder regeneration:", {
          reason: renewalDateChanged
            ? "No endDate provided"
            : "Renewal date unchanged",
          renewalDateChanged,
          hasEndDate:
            !!subscriptionData.endDate || !!existingSubscription?.endDate,
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating subscription:", error);
      return { data: null, error };
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting subscription:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error deleting subscription:", error);
      return { error };
    }
  };

  const fetchSubscriptionCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription-categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching subscription categories:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching subscription categories:", error);
      return { data: null, error };
    }
  };

  const fetchRenewalReminders = async () => {
    try {
      // Fetch reminders with reminder_type = "renewal" and join with subscriptions to get subscription names
      const { data, error } = await supabase
        .from("reminders")
        .select(
          `
          id,
          subscription_id,
          reminder_date,
          reminder_type,
          subscriptions!inner(nameOfSubscription)
        `
        )
        .eq("reminder_type", "renewal")
        .order("reminder_date", { ascending: true });

      if (error) {
        console.error("Error fetching renewal reminders:", error);
        return { data: null, error };
      }

      // Transform the data to include subscription_name
      const transformedData =
        data?.map((reminder) => {
          const subscription = reminder.subscriptions as unknown as {
            nameOfSubscription: string;
          };
          return {
            id: reminder.id,
            subscription_id: reminder.subscription_id,
            reminder_date: reminder.reminder_date,
            subscription_name: subscription?.nameOfSubscription || "Unknown",
          };
        }) || null;

      return { data: transformedData, error: null };
    } catch (error) {
      console.error("Error fetching renewal reminders:", error);
      return { data: null, error };
    }
  };

  // Contact management functions
  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching contacts:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return { data: null, error };
    }
  };

  const createContact = async (contactData: ContactInsert) => {
    try {
      const now = new Date().toISOString();
      const insertData = {
        ...contactData,
        ownedBy: user?.id || "",
        createdAt: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("contacts")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating contact:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error creating contact:", error);
      return { data: null, error };
    }
  };

  const updateContact = async (id: string, contactData: ContactUpdate) => {
    try {
      const now = new Date().toISOString();
      const updateData = {
        ...contactData,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("contacts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating contact:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating contact:", error);
      return { data: null, error };
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase.from("contacts").delete().eq("id", id);

      if (error) {
        console.error("Error deleting contact:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error deleting contact:", error);
      return { error };
    }
  };

  // Note management functions
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select(
          `
          *,
          note_categories:categoryId (
            id,
            name,
            color
          )
        `
        )
        .order("lastUpdatedDate", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching notes:", error);
      return { data: null, error };
    }
  };

  const createNote = async (noteData: NoteInsert) => {
    try {
      const now = new Date().toISOString();
      const insertData = {
        ...noteData,
        lastUpdatedBy: user?.id || "",
        lastUpdatedDate: now,
        createdAt: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(insertData)
        .select(
          `
          *,
          note_categories:categoryId (
            id,
            name,
            color
          )
        `
        )
        .single();

      if (error) {
        console.error("Error creating note:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error creating note:", error);
      return { data: null, error };
    }
  };

  const updateNote = async (id: string, noteData: NoteUpdate) => {
    try {
      const now = new Date().toISOString();
      const updateData = {
        ...noteData,
        lastUpdatedBy: user?.id || "",
        lastUpdatedDate: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("notes")
        .update(updateData)
        .eq("id", id)
        .select(
          `
          *,
          note_categories:categoryId (
            id,
            name,
            color
          )
        `
        )
        .single();

      if (error) {
        console.error("Error updating note:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating note:", error);
      return { data: null, error };
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) {
        console.error("Error deleting note:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error deleting note:", error);
      return { error };
    }
  };

  // Note category management functions
  const fetchNoteCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("note-categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching note categories:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching note categories:", error);
      return { data: null, error };
    }
  };

  const createNoteCategory = async (categoryData: NoteCategoryInsert) => {
    try {
      const now = new Date().toISOString();
      const insertData = {
        ...categoryData,
        createdAt: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("note-categories")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating note category:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error creating note category:", error);
      return { data: null, error };
    }
  };

  const updateNoteCategory = async (
    id: string,
    categoryData: NoteCategoryUpdate
  ) => {
    try {
      const now = new Date().toISOString();
      const updateData = {
        ...categoryData,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("note-categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating note category:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating note category:", error);
      return { data: null, error };
    }
  };

  const deleteNoteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("note-categories")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting note category:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error deleting note category:", error);
      return { error };
    }
  };

  // Document management functions
  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("createdDate", { ascending: false });

      if (error) {
        console.error("Error fetching documents:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching documents:", error);
      return { data: null, error };
    }
  };

  const createDocument = async (documentData: DocumentInsert) => {
    try {
      const now = new Date().toISOString();
      const insertData = {
        ...documentData,
        createdDate: now,
        lastModifiedDate: now,
        createdAt: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("documents")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating document:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error creating document:", error);
      return { data: null, error };
    }
  };

  const updateDocument = async (id: string, documentData: DocumentUpdate) => {
    try {
      const now = new Date().toISOString();
      const updateData = {
        ...documentData,
        lastModifiedDate: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("documents")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating document:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating document:", error);
      return { data: null, error };
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase.from("documents").delete().eq("id", id);

      if (error) {
        console.error("Error deleting document:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error deleting document:", error);
      return { error };
    }
  };

  // Document category management functions
  const fetchDocumentCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("document-categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching document categories:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching document categories:", error);
      return { data: null, error };
    }
  };

  const createDocumentCategory = async (
    categoryData: DocumentCategoryInsert
  ) => {
    try {
      const now = new Date().toISOString();
      const insertData = {
        ...categoryData,
        createdAt: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("document-categories")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating document category:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error creating document category:", error);
      return { data: null, error };
    }
  };

  const updateDocumentCategory = async (
    id: string,
    categoryData: DocumentCategoryUpdate
  ) => {
    try {
      const now = new Date().toISOString();
      const updateData = {
        ...categoryData,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("document-categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating document category:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating document category:", error);
      return { data: null, error };
    }
  };

  const deleteDocumentCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("document-categories")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting document category:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error deleting document category:", error);
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    allUsers,
    allUsersLoading,
    signUp,
    signIn,
    signOut,
    createUserProfile,
    createFirstUserProfile,
    fetchUserProfile,
    updateUser,
    fetchAllUsers,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    fetchSubscriptionCategories,
    fetchRenewalReminders,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    fetchNoteCategories,
    createNoteCategory,
    updateNoteCategory,
    deleteNoteCategory,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    fetchDocumentCategories,
    createDocumentCategory,
    updateDocumentCategory,
    deleteDocumentCategory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
