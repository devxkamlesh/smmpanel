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
// SERVICE MANAGEMENT
// ============================================================

/**
 * Get single service by ID
 */
export async function getServiceById(serviceId: number) {
  try {
    const { supabase } = await checkAdminAuth();

    const { data, error } = await supabase
      .from("services")
      .select("*, category:categories(*)")
      .eq("id", serviceId)
      .single();

    if (error) {
      console.error("Error fetching service:", error);
      throw new Error("Failed to fetch service");
    }

    return { success: true, service: data };
  } catch (error: any) {
    console.error("getServiceById error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update service
 */
export async function updateService(serviceId: number, data: {
  name?: string;
  description?: string;
  category_id?: number;
  type?: "default" | "subscription" | "drip-feed";
  rate?: number;
  min_quantity?: number;
  max_quantity?: number;
  refill?: boolean;
  refill_days?: number | null;
  average_time?: string;
  speed?: string;
  quality?: string;
  country?: string;
  provider_service_id?: string;
  provider_id?: number | null;
  is_active?: boolean;
}) {
  try {
    const { supabase } = await checkAdminAuth();

    // Validation
    if (data.rate !== undefined && data.rate < 0) {
      throw new Error("Rate cannot be negative");
    }

    if (data.min_quantity !== undefined && data.min_quantity < 0) {
      throw new Error("Minimum quantity cannot be negative");
    }

    if (data.max_quantity !== undefined && data.max_quantity < 1) {
      throw new Error("Maximum quantity must be at least 1");
    }

    if (data.min_quantity !== undefined && data.max_quantity !== undefined) {
      if (data.min_quantity > data.max_quantity) {
        throw new Error("Minimum quantity cannot be greater than maximum quantity");
      }
    }

    const { error } = await supabase
      .from("services")
      .update(data)
      .eq("id", serviceId);

    if (error) {
      console.error("Error updating service:", error);
      throw new Error("Failed to update service");
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/new-order");

    return { success: true, message: "Service updated successfully" };
  } catch (error: any) {
    console.error("updateService error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create new service
 */
export async function createService(data: {
  name: string;
  description?: string;
  category_id: number;
  type: "default" | "subscription" | "drip-feed";
  rate: number;
  min_quantity: number;
  max_quantity: number;
  refill?: boolean;
  refill_days?: number | null;
  average_time?: string;
  speed?: string;
  quality?: string;
  country?: string;
  provider_service_id?: string;
  provider_id?: number | null;
  is_active?: boolean;
}) {
  try {
    const { supabase } = await checkAdminAuth();

    // Validation
    if (!data.name || data.name.trim().length < 3) {
      throw new Error("Service name must be at least 3 characters");
    }

    if (data.rate < 0) {
      throw new Error("Rate cannot be negative");
    }

    if (data.min_quantity < 0) {
      throw new Error("Minimum quantity cannot be negative");
    }

    if (data.max_quantity < 1) {
      throw new Error("Maximum quantity must be at least 1");
    }

    if (data.min_quantity > data.max_quantity) {
      throw new Error("Minimum quantity cannot be greater than maximum quantity");
    }

    // Check if category exists
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("id", data.category_id)
      .single();

    if (categoryError || !category) {
      throw new Error("Invalid category");
    }

    const { error } = await supabase
      .from("services")
      .insert({
        ...data,
        is_active: data.is_active ?? true,
      });

    if (error) {
      console.error("Error creating service:", error);
      throw new Error("Failed to create service");
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/new-order");

    return { success: true, message: "Service created successfully" };
  } catch (error: any) {
    console.error("createService error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Duplicate service
 */
export async function duplicateService(serviceId: number) {
  try {
    const { supabase } = await checkAdminAuth();

    // Get original service
    const { data: original, error: fetchError } = await supabase
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .single();

    if (fetchError || !original) {
      throw new Error("Service not found");
    }

    // Create duplicate
    const { id, created_at, ...serviceData } = original;
    const { error } = await supabase
      .from("services")
      .insert({
        ...serviceData,
        name: `${serviceData.name} (Copy)`,
        is_active: false, // Disable by default
      });

    if (error) {
      console.error("Error duplicating service:", error);
      throw new Error("Failed to duplicate service");
    }

    revalidatePath("/admin/services");

    return { success: true, message: "Service duplicated successfully" };
  } catch (error: any) {
    console.error("duplicateService error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk update services
 */
export async function bulkUpdateServices(serviceIds: number[], data: {
  is_active?: boolean;
  rate?: number;
  category_id?: number;
}) {
  try {
    const { supabase } = await checkAdminAuth();

    if (serviceIds.length === 0) {
      throw new Error("No services selected");
    }

    const { error } = await supabase
      .from("services")
      .update(data)
      .in("id", serviceIds);

    if (error) {
      console.error("Error bulk updating services:", error);
      throw new Error("Failed to update services");
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/new-order");

    return { 
      success: true, 
      message: `${serviceIds.length} service(s) updated successfully` 
    };
  } catch (error: any) {
    console.error("bulkUpdateServices error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update service rate with percentage
 */
export async function updateServiceRateByPercentage(
  serviceId: number, 
  percentage: number,
  operation: "increase" | "decrease"
) {
  try {
    const { supabase } = await checkAdminAuth();

    // Get current rate
    const { data: service, error: fetchError } = await supabase
      .from("services")
      .select("rate")
      .eq("id", serviceId)
      .single();

    if (fetchError || !service) {
      throw new Error("Service not found");
    }

    const currentRate = Number(service.rate);
    const multiplier = operation === "increase" ? (1 + percentage / 100) : (1 - percentage / 100);
    const newRate = (currentRate * multiplier).toFixed(4);

    const { error } = await supabase
      .from("services")
      .update({ rate: newRate })
      .eq("id", serviceId);

    if (error) {
      console.error("Error updating rate:", error);
      throw new Error("Failed to update rate");
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/new-order");

    return { 
      success: true, 
      message: `Rate ${operation}d by ${percentage}%`,
      oldRate: currentRate,
      newRate: Number(newRate),
    };
  } catch (error: any) {
    console.error("updateServiceRateByPercentage error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk update rates by percentage
 */
export async function bulkUpdateRatesByPercentage(
  serviceIds: number[],
  percentage: number,
  operation: "increase" | "decrease"
) {
  try {
    const { supabase } = await checkAdminAuth();

    if (serviceIds.length === 0) {
      throw new Error("No services selected");
    }

    // Get all services
    const { data: services, error: fetchError } = await supabase
      .from("services")
      .select("id, rate")
      .in("id", serviceIds);

    if (fetchError || !services) {
      throw new Error("Failed to fetch services");
    }

    // Update each service
    const multiplier = operation === "increase" ? (1 + percentage / 100) : (1 - percentage / 100);
    
    for (const service of services) {
      const newRate = (Number(service.rate) * multiplier).toFixed(4);
      
      await supabase
        .from("services")
        .update({ rate: newRate })
        .eq("id", service.id);
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/new-order");

    return { 
      success: true, 
      message: `${serviceIds.length} service(s) rates ${operation}d by ${percentage}%` 
    };
  } catch (error: any) {
    console.error("bulkUpdateRatesByPercentage error:", error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// CATEGORY MANAGEMENT
// ============================================================

/**
 * Create new category
 */
export async function createCategory(data: {
  name: string;
  platform: string;
  icon_url?: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  try {
    const { supabase } = await checkAdminAuth();

    if (!data.name || data.name.trim().length < 3) {
      throw new Error("Category name must be at least 3 characters");
    }

    const { error } = await supabase
      .from("categories")
      .insert({
        ...data,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order ?? 0,
      });

    if (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/new-order");

    return { success: true, message: "Category created successfully" };
  } catch (error: any) {
    console.error("createCategory error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update category
 */
export async function updateCategory(categoryId: number, data: {
  name?: string;
  platform?: string;
  icon_url?: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  try {
    const { supabase } = await checkAdminAuth();

    const { error } = await supabase
      .from("categories")
      .update(data)
      .eq("id", categoryId);

    if (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category");
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/new-order");

    return { success: true, message: "Category updated successfully" };
  } catch (error: any) {
    console.error("updateCategory error:", error);
    return { success: false, error: error.message };
  }
}
