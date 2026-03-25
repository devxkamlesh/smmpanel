"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================
// USER MANAGEMENT
// ============================================================

export async function getAllUsers() {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: "user" | "admin" | "reseller") {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) throw error;
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserStatus(userId: string, status: "active" | "suspended" | "banned") {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", userId);

  if (error) throw error;
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserBalance(userId: string, amount: number) {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ balance: amount })
    .eq("id", userId);

  if (error) throw error;
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) throw error;
  revalidatePath("/admin/users");
  return { success: true };
}

// ============================================================
// STATISTICS
// ============================================================

export async function getAdminStats() {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const [usersResult, ordersResult, transactionsResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("transactions").select("amount").eq("status", "completed"),
  ]);

  const totalRevenue = transactionsResult.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return {
    totalUsers: usersResult.count || 0,
    totalOrders: ordersResult.count || 0,
    totalRevenue,
  };
}

// ============================================================
// SERVICE MANAGEMENT
// ============================================================

export async function getAllServices() {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("services")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function toggleServiceStatus(serviceId: number, isActive: boolean) {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("services")
    .update({ is_active: isActive })
    .eq("id", serviceId);

  if (error) throw error;
  revalidatePath("/admin/services");
  return { success: true };
}

export async function deleteService(serviceId: number) {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) throw error;
  revalidatePath("/admin/services");
  return { success: true };
}

// ============================================================
// CATEGORY MANAGEMENT
// ============================================================

export async function getAllCategories() {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function toggleCategoryStatus(categoryId: number, isActive: boolean) {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("categories")
    .update({ is_active: isActive })
    .eq("id", categoryId);

  if (error) throw error;
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(categoryId: number) {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw error;
  revalidatePath("/admin/categories");
  return { success: true };
}
