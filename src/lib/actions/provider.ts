"use server";

import { createClient } from "@/lib/supabase/server";
import { getProviderForService } from "@/lib/providers";
import { revalidatePath } from "next/cache";

/**
 * Update order status from provider
 * Can be called manually or via cron job
 */
export async function updateOrderStatus(orderId: number) {
  const supabase = await createClient();

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, service:services(*)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return { success: false, error: "Order not found" };
  }

  // Only update if order has external_order_id and is not completed
  if (!order.external_order_id || order.status === "completed") {
    return { success: false, error: "Order cannot be updated" };
  }

  try {
    const providerInfo = await getProviderForService(order.service_id);

    if (!providerInfo) {
      return { success: false, error: "Provider not configured" };
    }

    const { provider } = providerInfo;

    // Get status from provider
    const statusResponse = await provider.getOrderStatus({
      order: order.external_order_id,
    });

    if (!statusResponse.success) {
      return { success: false, error: statusResponse.error };
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: statusResponse.status,
        start_count: statusResponse.start_count,
        remains: statusResponse.remains,
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order:", updateError);
      return { success: false, error: "Failed to update order" };
    }

    revalidatePath("/orders");
    revalidatePath("/admin");

    return {
      success: true,
      status: statusResponse.status,
      remains: statusResponse.remains,
    };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update all pending/processing orders
 * Should be called by cron job
 */
export async function updateAllPendingOrders() {
  const supabase = await createClient();

  // Get all orders that need updating
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, external_order_id")
    .in("status", ["pending", "processing", "in_progress"])
    .not("external_order_id", "is", null)
    .limit(100); // Process 100 at a time

  if (error || !orders) {
    return { success: false, error: "Failed to fetch orders" };
  }

  const results = {
    total: orders.length,
    updated: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Update each order
  for (const order of orders) {
    const result = await updateOrderStatus(order.id);
    if (result.success) {
      results.updated++;
    } else {
      results.failed++;
      results.errors.push(`Order ${order.id}: ${result.error}`);
    }
  }

  return {
    success: true,
    results,
  };
}

/**
 * Get provider balance
 * Admin only
 */
export async function getProviderBalance() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const providerInfo = await getProviderForService(1); // Use default provider

    if (!providerInfo) {
      return { success: false, error: "Provider not configured" };
    }

    const { provider } = providerInfo;
    const balance = await provider.getBalance();

    return balance;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Test provider connection
 * Admin only
 */
export async function testProviderConnection() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const providerInfo = await getProviderForService(1);

    if (!providerInfo) {
      return { 
        success: false, 
        error: "Provider not configured. Set PROVIDER_API_URL and PROVIDER_API_KEY in .env.local" 
      };
    }

    const { provider } = providerInfo;
    const balance = await provider.getBalance();

    if (balance.success) {
      return {
        success: true,
        message: `Connected to ${provider.getName()}`,
        balance: balance.balance,
        currency: balance.currency,
      };
    } else {
      return {
        success: false,
        error: balance.error || "Connection failed",
      };
    }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Connection test failed" 
    };
  }
}
