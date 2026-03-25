"use server";

import { createClient } from "@/lib/supabase/server";
import { getProviderForService } from "@/lib/providers";

/**
 * Cron job to update order statuses from provider
 * Run this every 5-10 minutes
 */
export async function updateOrderStatuses() {
  console.log("[CRON] Starting order status update...");
  
  try {
    // Create admin client (bypass RLS)
    const supabase = await createClient();

    // Get all pending/processing/in_progress orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, service:services(*)")
      .in("status", ["pending", "processing", "in_progress"])
      .not("external_order_id", "is", null)
      .limit(100);

    if (error) {
      console.error("[CRON] Error fetching orders:", error);
      return { success: false, error: error.message };
    }

    if (!orders || orders.length === 0) {
      console.log("[CRON] No orders to update");
      return { success: true, updated: 0 };
    }

    console.log(`[CRON] Found ${orders.length} orders to check`);

    let updated = 0;
    let failed = 0;

    // Update each order
    for (const order of orders) {
      try {
        // Get provider for this service
        const provider = await getProviderForService(order.service_id);
        if (!provider) {
          console.log(`[CRON] No provider for order ${order.id}`);
          continue;
        }

        // Get status from provider
        const statusResponse = await provider.getOrderStatus({
          order_id: order.external_order_id!,
        });

        if (!statusResponse.success) {
          console.log(`[CRON] Failed to get status for order ${order.id}`);
          failed++;
          continue;
        }

        // Map provider status to our status
        const newStatus = mapProviderStatus(statusResponse.status);
        
        // Only update if status changed
        if (newStatus !== order.status) {
          const updateData: any = {
            status: newStatus,
            updated_at: new Date().toISOString(),
          };

          // Update start_count and remains if provided
          if (statusResponse.start_count !== undefined) {
            updateData.start_count = statusResponse.start_count;
          }
          if (statusResponse.remains !== undefined) {
            updateData.remains = statusResponse.remains;
          }

          const { error: updateError } = await supabase
            .from("orders")
            .update(updateData)
            .eq("id", order.id);

          if (updateError) {
            console.error(`[CRON] Error updating order ${order.id}:`, updateError);
            failed++;
          } else {
            console.log(`[CRON] Updated order ${order.id}: ${order.status} → ${newStatus}`);
            updated++;

            // Handle refunds for failed/cancelled orders
            if (newStatus === "cancelled" || newStatus === "refunded") {
              await handleOrderRefund(supabase, order);
            }
          }
        }
      } catch (error: any) {
        console.error(`[CRON] Error processing order ${order.id}:`, error);
        failed++;
      }
    }

    console.log(`[CRON] Completed: ${updated} updated, ${failed} failed`);
    return { success: true, updated, failed };
  } catch (error: any) {
    console.error("[CRON] Fatal error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Map provider status to our internal status
 */
function mapProviderStatus(providerStatus: string): string {
  const statusMap: Record<string, string> = {
    pending: "pending",
    processing: "processing",
    "in progress": "in_progress",
    completed: "completed",
    partial: "partial",
    canceled: "cancelled",
    cancelled: "cancelled",
    refunded: "refunded",
  };

  return statusMap[providerStatus.toLowerCase()] || "pending";
}

/**
 * Handle refund for cancelled/refunded orders
 */
async function handleOrderRefund(supabase: any, order: any) {
  try {
    // Get user's current balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", order.user_id)
      .single();

    if (!profile) return;

    const newBalance = Number(profile.balance) + Number(order.charge);

    // Update user balance
    await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", order.user_id);

    // Create refund transaction
    await supabase.from("transactions").insert({
      user_id: order.user_id,
      type: "refund",
      amount: order.charge,
      balance_after: newBalance,
      description: `Refund for order #${order.id}`,
      status: "completed",
    });

    console.log(`[CRON] Refunded $${order.charge} for order ${order.id}`);
  } catch (error) {
    console.error(`[CRON] Error refunding order ${order.id}:`, error);
  }
}
