"use client";

import { useState } from "react";
import { approveFundRequest, rejectFundRequest } from "@/lib/actions/wallet";
import { CheckCircle2, XCircle, Loader2, Clock, DollarSign } from "lucide-react";

interface Transaction {
  id: number;
  user_id: string;
  type: string;
  amount: number;
  balance_after: number | null;
  description: string | null;
  payment_method: string | null;
  payment_id: string | null;
  status: string;
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
}

interface TransactionsClientProps {
  pendingTransactions: Transaction[];
  allTransactions: Transaction[];
}

export default function TransactionsClient({ 
  pendingTransactions, 
  allTransactions 
}: TransactionsClientProps) {
  const [loading, setLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

  const handleApprove = async (transactionId: number) => {
    if (!confirm("Approve this fund request?")) return;
    
    setLoading(transactionId);
    try {
      const result = await approveFundRequest(transactionId);
      if (result.success) {
        alert(result.message);
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (transactionId: number) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    setLoading(transactionId);
    try {
      const result = await rejectFundRequest(transactionId, reason);
      if (result.success) {
        alert(result.message);
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-500/10 text-yellow-500",
      completed: "bg-green-500/10 text-green-500",
      failed: "bg-red-500/10 text-red-500",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      deposit: "bg-green-500/10 text-green-500",
      purchase: "bg-blue-500/10 text-blue-500",
      refund: "bg-purple-500/10 text-purple-500",
      bonus: "bg-orange-500/10 text-orange-500",
    };
    return styles[type as keyof typeof styles] || styles.deposit;
  };

  const transactions = activeTab === "pending" ? pendingTransactions : allTransactions;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <p className="text-sm text-on-surface-variant">Pending Requests</p>
          </div>
          <p className="text-3xl font-bold text-on-surface">{pendingTransactions.length}</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <p className="text-sm text-on-surface-variant">Pending Amount</p>
          </div>
          <p className="text-3xl font-bold text-on-surface">
            ${pendingTransactions.reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <p className="text-sm text-on-surface-variant">Total Transactions</p>
          </div>
          <p className="text-3xl font-bold text-on-surface">{allTransactions.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-outline-variant/10">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Pending ({pendingTransactions.length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          All Transactions ({allTransactions.length})
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Date</th>
                {activeTab === "pending" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                    #{transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        {transaction.user?.username || "Unknown"}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {transaction.user?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeBadge(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                    ${Number(transaction.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant capitalize">
                    {transaction.payment_method?.replace("_", " ") || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {transaction.payment_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  {activeTab === "pending" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(transaction.id)}
                          disabled={loading === transaction.id}
                          className="p-2 rounded-lg hover:bg-green-500/10 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          {loading === transaction.id ? (
                            <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(transaction.id)}
                          disabled={loading === transaction.id}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
