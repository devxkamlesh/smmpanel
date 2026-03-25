"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

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
