"use client";

import { useState } from "react";
import { Layers, ArrowRight, AlertCircle } from "lucide-react";

export default function MassOrderPage() {
  const [orders, setOrders] = useState("");

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center text-white">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface">Mass Order</h1>
            <p className="text-sm text-on-surface-variant">
              Submit multiple orders at once
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-4 mb-5">
          <div className="flex items-start gap-2 text-sm text-on-surface-variant">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p>
              Enter one order per line in the format:{" "}
              <code className="px-2 py-0.5 rounded bg-surface-container text-primary text-xs font-mono">
                service_id | link | quantity
              </code>
            </p>
          </div>
        </div>

        <textarea
          value={orders}
          onChange={(e) => setOrders(e.target.value)}
          placeholder="12841 | https://instagram.com/p/example | 1000&#10;12842 | https://instagram.com/p/example2 | 500"
          rows={10}
          className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest ghost-border text-on-surface placeholder:text-outline text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
        />

        <button className="mt-5 w-full py-3 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container transition-colors shadow-card flex items-center justify-center gap-2 text-sm">
          Submit Mass Order <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
