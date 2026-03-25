"use client";

import { Code, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ApiDocsPage() {
  const [copied, setCopied] = useState(false);
  const apiKey = "sk-smm-xxxxxxxxxxxxxxxxxxxx";

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl animate-fade-in space-y-5">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface">API Documentation</h1>
            <p className="text-sm text-on-surface-variant">Integrate with our API</p>
          </div>
        </div>

        {/* API Key */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-on-surface mb-2">Your API Key</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-4 py-3 rounded-xl bg-surface-container-low text-sm font-mono text-on-surface ghost-border">
              {apiKey}
            </code>
            <button
              onClick={copyKey}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container ghost-border transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-on-surface-variant" />}
            </button>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-on-surface">Endpoints</h2>

          {[
            {
              method: "POST",
              endpoint: "/api/v2/order",
              desc: "Create a new order",
              params: "service, link, quantity",
            },
            {
              method: "GET",
              endpoint: "/api/v2/order/status",
              desc: "Check order status",
              params: "order_id",
            },
            {
              method: "GET",
              endpoint: "/api/v2/services",
              desc: "List all services",
              params: "—",
            },
            {
              method: "GET",
              endpoint: "/api/v2/balance",
              desc: "Check balance",
              params: "—",
            },
          ].map((ep, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-container-low ghost-border">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${ep.method === "POST" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-primary">{ep.endpoint}</code>
              </div>
              <p className="text-sm text-on-surface-variant">{ep.desc}</p>
              <p className="text-xs text-outline mt-1">Params: {ep.params}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
