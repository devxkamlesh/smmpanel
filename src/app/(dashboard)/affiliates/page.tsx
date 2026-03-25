"use client";

import { Share2, Copy, Check, DollarSign, Users, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function AffiliatesPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://smmpanel.com/register?ref=kamlesh007";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl animate-fade-in space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Referred Users", value: "0", color: "from-primary to-primary-container" },
          { icon: DollarSign, label: "Total Earnings", value: "$0.00", color: "from-secondary to-secondary-container" },
          { icon: TrendingUp, label: "Commission Rate", value: "5%", color: "from-tertiary to-tertiary-container" },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-2xl shadow-card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-sm text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Referral Link */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">Your Referral Link</h2>
            <p className="text-sm text-on-surface-variant">Share this link and earn commissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 px-4 py-3 rounded-xl bg-surface-container-low text-sm text-on-surface ghost-border font-mono"
          />
          <button
            onClick={copyLink}
            className="px-5 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-colors flex items-center gap-2 text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
