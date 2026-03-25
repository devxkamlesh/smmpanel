"use client";

import { Search, Filter, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Order, Service } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  partial: "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

interface OrdersClientProps {
  initialOrders: (Order & { service: Service })[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [search, setSearch] = useState("");

  const filtered = initialOrders.filter((order) =>
    order.service.name.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toString().includes(search)
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card">
        {/* Header */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-on-surface">Orders</h1>
            <p className="text-sm text-on-surface-variant">
              Track and manage your orders ({initialOrders.length} total)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 ghost-border"
              />
            </div>
            <button className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container ghost-border transition-colors">
              <Filter className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Charge</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-on-surface">#{order.id}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-on-surface max-w-[200px] truncate">{order.service.name}</td>
                    <td className="px-6 py-4">
                      <a href={order.link} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-container inline-flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[120px]">Link</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-on-surface">{order.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-on-surface">${order.charge.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || ""}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-outline-variant/10">
          <span className="text-sm text-on-surface-variant">
            Showing {filtered.length} of {initialOrders.length} orders
          </span>
        </div>
      </div>
    </div>
  );
}
