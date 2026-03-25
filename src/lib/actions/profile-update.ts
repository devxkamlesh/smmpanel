"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Update user profile
 */
export async function updateProfile(data: {
  username?: string;
  full_name?: string;
  email?: string;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validation
  if (data.username && data.username.length < 3) {
    return { success: false, error: "Username must be at least 3 characters" };
  }

  if (data.username && !/^[a-zA-Z0-9_]+$/.test(data.username)) {
    return { success: false, error: "Username can only contain letters, numbers, and underscores" };
  }

  // Check if username is taken (if changing)
  if (data.username) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", data.username)
      .neq("id", user.id)
      .single();

    if (existing) {
      return { success: false, error: "Username already taken" };
    }
  }

  // Update profile
  const updateData: any = {};
  if (data.username) updateData.username = data.username;
  if (data.full_name !== undefined) updateData.full_name = data.full_name;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }

  // Update email in auth if changed
  if (data.email && data.email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({
      email: data.email,
    });

    if (emailError) {
      console.error("Error updating email:", emailError);
      return { success: false, error: "Failed to update email. Please try again." };
    }
  }

  revalidatePath("/settings");
  revalidatePath("/");

  return {
    success: true,
    message: "Profile updated successfully",
  };
}

/**
 * Change password
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validation
  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  if (newPassword === currentPassword) {
    return { success: false, error: "New password must be different from current password" };
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Failed to change password. Please check your current password." };
  }

  return {
    success: true,
    message: "Password changed successfully",
  };
}

/**
 * Generate new API key
 */
export async function generateApiKey() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Generate random API key
  const apiKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  const { error } = await supabase
    .from("profiles")
    .update({ api_key: apiKey })
    .eq("id", user.id);

  if (error) {
    console.error("Error generating API key:", error);
    return { success: false, error: "Failed to generate API key" };
  }

  revalidatePath("/settings");

  return {
    success: true,
    apiKey,
    message: "API key generated successfully",
  };
}
