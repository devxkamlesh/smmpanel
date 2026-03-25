"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================
// HELPER: Check Admin Authorization
// ============================================================

async function checkAdminAuth() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Unauthorized - Admin access required");
  }

  return { supabase, userId: user.id };
}

// ============================================================
// USER MANAGEMENT
// ============================================================

export async function getAllUsers() {
  try {
    const { supabase } = await checkAdminAuth();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }

    return data || [];
  } catch (error: any) {
    console.error("getAllUsers error:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: "user" | "admin" | "reseller") {
  try {
    const { supabase } = await checkAdminAuth();

    const { error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Error updating role:", error);
      throw new Error("Failed to update user role");
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User role updated successfully" };
  } catch (error: any) {
    console.error("updateUserRole error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserStatus(userId: string, status: "active" | "suspended" | "banned") {
  try {
    const { supabase } = await checkAdminAuth();

    const { error } = await supabase
      .from("profiles")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Error updating status:", error);
      throw new Error("Failed to update user status");
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User status updated successfully" };
  } catch (error: any) {
    console.error("updateUserStatus error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserBalance(userId: string, amount: number) {
  try {
    const { supabase } = await checkAdminAuth();

    if (amount < 0) {
      throw new Error("Balance cannot be negative");
    }

    // Get current balance
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    const oldBalance = Number(currentProfile?.balance || 0);
    const difference = amount - oldBalance;

    // Update balance
    const { error } = await supabase
      .from("profiles")
      .update({ balance: amount, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Error updating balance:", error);
      throw new Error("Failed to update user balance");
    }

    // Create transaction record
    if (difference !== 0) {
      await supabase.from("transactions").insert({
        user_id: userId,
        type: difference > 0 ? "deposit" : "purchase",
        amount: Math.abs(difference),
        balance_after: amount,
        description: `Admin ${difference > 0 ? "added" : "deducted"} funds`,
        status: "completed",
      });
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User balance updated successfully" };
  } catch (error: any) {
    console.error("updateUserBalance error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const { supabase, userId: adminId } = await checkAdminAuth();

    // Prevent self-deletion
    if (userId === adminId) {
      throw new Error("Cannot delete your own account");
    }

    // Check if user has pending orders
    const { data: orders } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", userId)
      .in("status", ["pending", "processing", "in_progress"])
      .limit(1);

    if (orders && orders.length > 0) {
      throw new Error("Cannot delete user with pending orders");
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    console.error("deleteUser error:", error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// STATISTICS
// ============================================================

export async function getAdminStats() {
  try {
    const { supabase } = await checkAdminAuth();

    const [usersResult, ordersResult, transactionsResult, revenueResult] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("transactions").select("id", { count: "exact", head: true }),
      supabase.from("transactions").select("amount").eq("status", "completed").eq("type", "deposit"),
    ]);

    const totalRevenue = revenueResult.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return {
      totalUsers: usersResult.count || 0,
      totalOrders: ordersResult.count || 0,
      totalTransactions: transactionsResult.count || 0,
      totalRevenue,
    };
  } catch (error: any) {
    console.error("getAdminStats error:", error);
    return {
      totalUsers: 0,
      totalOrders: 0,
      totalTransactions: 0,
      totalRevenue: 0,
    };
  }
}

// ============================================================
// SERVICE MANAGEMENT
// ============================================================

export async function getAllServices() {
  try {
    const { supabase } = await checkAdminAuth();

    const { data, error } = await supabase
      .from("services")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
      throw new Error("Failed to fetch services");
    }

    return data || [];
  } catch (error: any) {
    console.error("getAllServices error:", error);
    return [];
  }
}

export async function toggleServiceStatus(serviceId: number, isActive: boolean) {
  try {
    const { supabase } = await checkAdminAuth();

    const { error } = await supabase
      .from("services")
      .update({ is_active: isActive })
      .eq("id", serviceId);

    if (error) {
      console.error("Error toggling service:", error);
      throw new Error("Failed to update service status");
    }

    revalidatePath("/admin/services");
    return { success: true, message: "Service status updated" };
  } catch (error: any) {
    console.error("toggleServiceStatus error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteService(serviceId: number) {
  try {
    const { supabase } = await checkAdminAuth();

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      console.error("Error deleting service:", error);
      throw new Error("Failed to delete service");
    }

    revalidatePath("/admin/services");
    return { success: true, message: "Service deleted successfully" };
  } catch (error: any) {
    console.error("deleteService error:", error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// CATEGORY MANAGEMENT
// ============================================================

export async function getAllCategories() {
  try {
    const { supabase } = await checkAdminAuth();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }

    return data || [];
  } catch (error: any) {
    console.error("getAllCategories error:", error);
    return [];
  }
}

export async function toggleCategoryStatus(categoryId: number, isActive: boolean) {
  try {
    const { supabase } = await checkAdminAuth();

    const { error } = await supabase
      .from("categories")
      .update({ is_active: isActive })
      .eq("id", categoryId);

    if (error) {
      console.error("Error toggling category:", error);
      throw new Error("Failed to update category status");
    }

    revalidatePath("/admin/categories");
    return { success: true, message: "Category status updated" };
  } catch (error: any) {
    console.error("toggleCategoryStatus error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(categoryId: number) {
  try {
    const { supabase } = await checkAdminAuth();

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }

    revalidatePath("/admin/categories");
    return { success: true, message: "Category deleted successfully" };
  } catch (error: any) {
    console.error("deleteCategory error:", error);
    return { success: false, error: error.message };
  }
}
