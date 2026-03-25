import { getPendingTransactions, getAllTransactions } from "@/lib/actions/wallet";
import TransactionsClient from "./transactions-client";
import { Receipt } from "lucide-react";

export default async function AdminTransactionsPage() {
  const [pendingTransactions, allTransactions] = await Promise.all([
    getPendingTransactions(),
    getAllTransactions(),
  ]);

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Receipt className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Transaction Management</h2>
          <p className="text-on-surface-variant">Approve or reject fund requests</p>
        </div>
      </div>

      <TransactionsClient 
        pendingTransactions={pendingTransactions} 
        allTransactions={allTransactions}
      />
    </div>
  );
}
