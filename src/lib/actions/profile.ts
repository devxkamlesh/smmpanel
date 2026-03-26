"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getProfile(): Promise<Profile | null> {
  // Disable caching to always get fresh data
  noStore();
  
  const supabase = await createClient();

  // Refresh the session to ensure we have the latest user data
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }

  // Fetch profile with detailed error logging
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      userId: user.id,
      userEmail: user.email,
      userMetadata: user.user_metadata,
    });

    // If profile doesn't exist, try to create it (fallback)
    if (error.code === "PGRST116") {
      console.log("Profile not found, attempting to create...");
      
      // Try multiple metadata fields (Supabase stores it differently)
      const username = 
        user.user_metadata?.username || 
        user.user_metadata?.data?.username ||
        user.email?.split("@")[0] || 
        "User";
      
      console.log("Creating profile with username:", username);
      
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username,
          email: user.email!,
          referral_code: Math.random().toString(36).substring(2, 10),
        })
        .select()
        .single();

      if (createError) {
        console.error("Failed to create profile:", {
          error: createError,
          attemptedUsername: username,
          userMetadata: user.user_metadata,
        });
        return null;
      }

      console.log("Profile created successfully:", newProfile);
      return newProfile as Profile;
    }

    return null;
  }

  // Log the fetched profile for debugging
  console.log("Profile fetched:", {
    username: data.username,
    email: data.email,
    userId: data.id,
  });

  return data as Profile;
}

export async function updateBalance(amount: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ balance: profile.balance + amount })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating balance:", error);
    return { success: false, error: "Failed to update balance" };
  }

  return { success: true };
}
