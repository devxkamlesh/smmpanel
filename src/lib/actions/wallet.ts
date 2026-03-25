"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Get user transactions
 */
export async function getTransactions() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}

/**
 * Request fund addition (creates pending transaction)
 * Admin will approve manually
 */
export async function requestFunds(amount: number, paymentMethod: string, paymentDetails: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validation
  if (amount <= 0) {
    return { success: false, error: "Amount must be greater than 0" };
  }

  if (amount < 5) {
    return { success: false, error: "Minimum deposit is $5" };
  }

  if (amount > 10000) {
    return { success: false, error: "Maximum deposit is $10,000" };
  }

  if (!paymentMethod || !paymentDetails) {
    return { success: false, error: "Payment details required" };
  }

  // Get current balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Create pending transaction
  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      type: "deposit",
      amount: amount,
      balance_after: Number(profile.balance), // Will be updated when approved
      description: `Fund request via ${paymentMethod}`,
      payment_method: paymentMethod,
      payment_id: paymentDetails,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create request" };
  }

  revalidatePath("/add-funds");
  revalidatePath("/transactions");

  return {
    success: true,
    transaction,
    message: "Fund request submitted. Admin will approve shortly.",
  };
}

/**
 * Admin: Approve fund request
 */
export async function approveFundRequest(transactionId: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  // Get transaction
  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (txError || !transaction) {
    return { success: false, error: "Transaction not found" };
  }

  if (transaction.status !== "pending") {
    return { success: false, error: "Transaction already processed" };
  }

  if (transaction.type !== "deposit") {
    return { success: false, error: "Invalid transaction type" };
  }

  // Get user profile
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", transaction.user_id)
    .single();

  if (profileError || !userProfile) {
    return { success: false, error: "User profile not found" };
  }

  const newBalance = Number(userProfile.balance) + Number(transaction.amount);

  // Update user balance
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ balance: newBalance })
    .eq("id", transaction.user_id);

  if (updateError) {
    console.error("Error updating balance:", updateError);
    return { success: false, error: "Failed to update balance" };
  }

  // Update transaction status
  const { error: txUpdateError } = await supabase
    .from("transactions")
    .update({
      status: "completed",
      balance_after: newBalance,
    })
    .eq("id", transactionId);

  if (txUpdateError) {
    console.error("Error updating transaction:", txUpdateError);
  }

  revalidatePath("/admin/transactions");
  revalidatePath("/add-funds");

  return {
    success: true,
    message: `Approved $${transaction.amount} for user`,
  };
}

/**
 * Admin: Reject fund request
 */
export async function rejectFundRequest(transactionId: number, reason: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  // Update transaction
  const { error } = await supabase
    .from("transactions")
    .update({
      status: "failed",
      description: `Rejected: ${reason}`,
    })
    .eq("id", transactionId)
    .eq("status", "pending");

  if (error) {
    console.error("Error rejecting transaction:", error);
    return { success: false, error: "Failed to reject request" };
  }

  revalidatePath("/admin/transactions");

  return {
    success: true,
    message: "Fund request rejected",
  };
}

/**
 * Admin: Get all pending transactions
 */
export async function getPendingTransactions() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return [];
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      user:profiles(username, email)
    `)
    .eq("status", "pending")
    .eq("type", "deposit")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending transactions:", error);
    return [];
  }

  return data;
}

/**
 * Admin: Get all transactions
 */
export async function getAllTransactions() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return [];
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      user:profiles(username, email)
    `)
    .order("created_at", { ascending: false})
    .limit(100);

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}
