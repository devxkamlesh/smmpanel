"use client";

import { Users, Plus, Globe, Settings } from "lucide-react";

export default function ChildPanelPage() {
  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">Child Panel</h1>
              <p className="text-sm text-on-surface-variant">Create and manage reseller panels</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors shadow-card">
            <Plus className="w-4 h-4" />
            Create Panel
          </button>
        </div>

        {/* Empty state */}
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-outline" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface">No child panels yet</h3>
          <p className="mt-2 text-sm text-on-surface-variant max-w-md mx-auto">
            Create a child panel to start reselling services under your own brand with custom markup.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors shadow-card">
            <Plus className="w-4 h-4" />
            Create Your First Panel
          </button>
        </div>
      </div>
    </div>
  );
}
