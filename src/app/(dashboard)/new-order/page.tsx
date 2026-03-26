import { getServices } from "@/lib/actions/services";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrderForm from "./order-form";
import { ShoppingCart } from "lucide-react";

export default async function NewOrderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  const userBalance = profile?.balance || 0;

  // Get all active services
  const services = await getServices();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">New Order</h1>
          <p className="text-sm md:text-base text-on-surface-variant">Select a service and place your order</p>
        </div>
      </div>

      <OrderForm services={services} userBalance={Number(userBalance)} />
    </div>
  );
}
