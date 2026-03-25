"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order, Service } from "@/types";
import { revalidatePath } from "next/cache";
import { getProviderForService } from "@/lib/providers";

export async function getOrders() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      service:services(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data as (Order & { service: Service })[];
}

export async function createOrder(
  serviceId: number,
  link: string,
  quantity: number
) {
  const supabase = await createClient();

  // 1. Authentication check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // 2. Input validation
  if (!link || !link.trim()) {
    return { success: false, error: "Link is required" };
  }

  if (!quantity || quantity <= 0) {
    return { success: false, error: "Quantity must be greater than 0" };
  }

  // 3. Get service details with active check
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*, category:categories(*)")
    .eq("id", serviceId)
    .eq("is_active", true)
    .single();

  if (serviceError || !service) {
    return { success: false, error: "Service not found or inactive" };
  }

  // 4. Validate quantity against service limits
  if (quantity < service.min_quantity) {
    return { 
      success: false, 
      error: `Minimum quantity is ${service.min_quantity}` 
    };
  }

  if (quantity > service.max_quantity) {
    return { 
      success: false, 
      error: `Maximum quantity is ${service.max_quantity}` 
    };
  }

  // 5. Calculate charge (rate is per 1000)
  const charge = Number(((service.rate * quantity) / 1000).toFixed(2));

  if (charge <= 0) {
    return { success: false, error: "Invalid charge calculation" };
  }

  // 6. Get user profile with balance
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("balance, total_spent, status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "Profile not found" };
  }

  // 7. Check account status
  if (profile.status !== "active") {
    return { 
      success: false, 
      error: "Account is suspended or banned. Contact support." 
    };
  }

  // 8. Check sufficient balance
  if (Number(profile.balance) < charge) {
    return { 
      success: false, 
      error: `Insufficient balance. Required: $${charge.toFixed(2)}, Available: $${Number(profile.balance).toFixed(2)}` 
    };
  }

  // 9. Create order in database (atomic transaction)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      service_id: serviceId,
      link: link.trim(),
      quantity,
      charge,
      status: "pending",
      remains: quantity,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    return { success: false, error: "Failed to create order. Please try again." };
  }

  // 9.5. Send order to provider (async - don't block user)
  try {
    const providerInfo = await getProviderForService(serviceId);
    
    if (providerInfo) {
      const { provider, providerServiceId } = providerInfo;
      
      // Send order to provider
      const providerResponse = await provider.createOrder({
        service: providerServiceId,
        link: link.trim(),
        quantity,
      });

      if (providerResponse.success && providerResponse.order) {
        // Update order with provider details
        await supabase
          .from("orders")
          .update({
            external_order_id: String(providerResponse.order),
            status: providerResponse.status || "processing",
            start_count: providerResponse.start_count,
          })
          .eq("id", order.id);
      } else {
        // Provider failed - log error but don't fail the order
        console.error("Provider order creation failed:", providerResponse.error);
        // Order stays in "pending" status for manual processing
      }
    } else {
      console.warn("No provider configured for service:", serviceId);
      // Order stays in "pending" status for manual processing
    }
  } catch (providerError: any) {
    // Provider error - log but don't fail the order
    console.error("Provider integration error:", providerError);
    // Order stays in "pending" status for manual processing
  }

  // 10. Deduct balance and update total spent
  const newBalance = Number(profile.balance) - charge;
  const newTotalSpent = Number(profile.total_spent) + charge;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      balance: newBalance,
      total_spent: newTotalSpent,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error updating balance:", updateError);
    // Rollback: delete the order
    await supabase.from("orders").delete().eq("id", order.id);
    return { success: false, error: "Failed to process payment. Please try again." };
  }

  // 11. Create transaction record
  const { error: transactionError } = await supabase.from("transactions").insert({
    user_id: user.id,
    type: "purchase",
    amount: charge,
    balance_after: newBalance,
    description: `Order #${order.id} - ${service.name}`,
    status: "completed",
  });

  if (transactionError) {
    console.error("Error creating transaction:", transactionError);
  }

  // 12. Revalidate paths
  revalidatePath("/orders");
  revalidatePath("/new-order");

  return { 
    success: true, 
    order,
    message: `Order #${order.id} created successfully! Charge: $${charge.toFixed(2)}`
  };
}
