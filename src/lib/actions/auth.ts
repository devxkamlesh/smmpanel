"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendWelcomeEmail } from "@/lib/email/client";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/new-order");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const supabase = await createClient();

  console.log("Signing up user with username:", username);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: undefined, // Disable email confirmation
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { success: false, error: error.message };
  }

  console.log("User signed up successfully:", {
    userId: data.user?.id,
    email: data.user?.email,
    metadata: data.user?.user_metadata,
  });

  // Send welcome email (non-blocking) - commented out to avoid rate limit
  // sendWelcomeEmail(email, username).catch((err) => {
  //   console.error("Failed to send welcome email:", err);
  // });

  revalidatePath("/", "layout");
  redirect("/new-order");
}
