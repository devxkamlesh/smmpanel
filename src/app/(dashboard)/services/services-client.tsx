"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLATFORMS, type Service, type Category } from "@/types";

interface ServicesClientProps {
  initialServices: (Service & { category: Category })[];
}

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const router = useRouter();

  const filtered = initialServices.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platform === "all" || s.category.platform === platform;
    return matchesSearch && matchesPlatform;
  });

  const handleServiceClick = (serviceId: number) => {
    router.push(`/new-order?service=${serviceId}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-on-surface">Services</h1>
            <p className="text-sm text-on-surface-variant">
              Browse all available services ({initialServices.length} total)
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 ghost-border w-64"
            />
          </div>
        </div>

        {/* Platform filter */}
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setPlatform("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              platform === "all"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container ghost-border"
            }`}
          >
            All
          </button>
          {PLATFORMS.slice(0, 10).map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                platform === p.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container ghost-border"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Rate/1K</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Min</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Max</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Avg Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map((svc) => (
                <tr 
                  key={svc.id} 
                  onClick={() => handleServiceClick(svc.id)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  title="Click to order this service"
                >
                  <td className="px-6 py-4 font-medium text-on-surface">{svc.id}</td>
                  <td className="px-6 py-4 text-on-surface">{svc.name}</td>
                  <td className="px-6 py-4 font-semibold text-primary">${svc.rate.toFixed(4)}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{svc.min_quantity.toLocaleString()}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{svc.max_quantity.toLocaleString()}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{svc.average_time || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
