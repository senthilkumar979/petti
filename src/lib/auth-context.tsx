"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
} from "@/types/database";

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
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
  };

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

      return { error: null };
    } catch (error) {
      console.error("Error updating user:", error);
      return { error };
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("addedOn", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { data: null, error };
    }
  };

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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
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

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
