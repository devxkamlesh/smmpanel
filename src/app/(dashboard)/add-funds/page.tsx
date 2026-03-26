import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddFundsClient from "./add-funds-client";
import { Wallet } from "lucide-react";

export default async function AddFundsPage() {
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

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-5 md:w-6 h-5 md:h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Add Funds</h1>
          <p className="text-sm md:text-base text-on-surface-variant">Top up your wallet balance</p>
        </div>
      </div>

      <AddFundsClient userBalance={Number(userBalance)} />
    </div>
  );
}
