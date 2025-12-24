"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { User as UserType, UserInsert } from "@/types/database";
import { useAuth } from "@/lib/auth-context";

interface InviteUserData {
  email: string;
  name: string;
  picture?: File;
}

export const useUsers = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<UserType[]> => {
      console.log("🟡 useUsers: Fetching users");
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("addedOn", { ascending: false });

      if (error) {
        console.error("🟡 useUsers: Error fetching users", error);
        throw new Error(error.message);
      }

      console.log("🟡 useUsers: Users fetched successfully", {
        count: data?.length || 0,
      });
      return data || [];
    },
  });

  console.log("🟡 useUsers: Hook state", {
    isLoading,
    usersCount: users.length,
    hasError: !!error,
  });

  // Upload picture to Supabase Storage
  const uploadPicture = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading picture:", error);
      return null;
    }
  };

  // Check if email is unique
  const checkEmailUnique = async (email: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }

    return !data; // Return true if no user found (email is unique)
  };

  // Send invitation email
  const sendInvitationEmail = async (userData: InviteUserData) => {
    if (!currentUser) return;

    const response = await fetch("/api/invite-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        inviterName: currentUser.user_metadata?.name || currentUser.email,
        inviterEmail: currentUser.email,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send invitation email");
    }

    return response.json();
  };

  // Invite user mutation
  const inviteUserMutation = useMutation({
    mutationFn: async (userData: InviteUserData): Promise<UserType> => {
      // Check if email is unique
      const isEmailUnique = await checkEmailUnique(userData.email);
      if (!isEmailUnique) {
        throw new Error("Email address is already in use");
      }

      // Upload picture if provided
      let pictureUrl: string | null = null;
      if (userData.picture) {
        pictureUrl = await uploadPicture(userData.picture);
      }

      // Create user record
      const userInsert: UserInsert = {
        email: userData.email,
        name: userData.name,
        picture: pictureUrl,
        addedBy: currentUser?.id || null,
      };

      const { data, error } = await supabase
        .from("users")
        .insert(userInsert)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Send invitation email
      await sendInvitationEmail(userData);

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDrawerOpen(false);
    },
  });

  return {
    users,
    isLoading,
    error,
    isDrawerOpen,
    setIsDrawerOpen,
    inviteUser: inviteUserMutation.mutateAsync,
    isInviting: inviteUserMutation.isPending,
    inviteError: inviteUserMutation.error?.message,
  };
};
