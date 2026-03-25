"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/types";
import {
  PlusCircle,
  Layers,
  Wallet,
  MessageSquare,
  Settings,
  ShoppingCart,
  Code,
  Users,
  Share2,
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "New order", href: "/new-order", icon: PlusCircle },
  { label: "Mass order", href: "/mass-order", icon: Layers },
  { label: "Add funds", href: "/add-funds", icon: Wallet },
  { label: "Tickets", href: "/tickets", icon: MessageSquare },
  { label: "Services", href: "/services", icon: Settings },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "API", href: "/api-docs", icon: Code },
  { label: "Child panel", href: "/child-panel", icon: Users },
  { label: "Affiliates", href: "/affiliates", icon: Share2 },
  { label: "Settings", href: "/settings", icon: User },
];

const ADMIN_NAV_ITEMS = [
  { label: "Admin Panel", href: "/admin", icon: Shield },
];

interface DashboardClientProps {
  profile: Profile | null;
  children: React.ReactNode;
}

export default function DashboardClient({ profile, children }: DashboardClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = profile?.username?.slice(0, 2).toUpperCase() || "U";
  const displayName = profile?.username || "User";
  const balance = profile?.balance || 0;
  const accountPoints = profile?.account_points || 0;
  const totalSpent = profile?.total_spent || 0;
  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-surface flex">
      {/* ============== SIDEBAR ============== */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-inverse-surface/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-surface-container-lowest shadow-ambient flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:inset-auto`}
      >
        {/* User profile section */}
        <div className="p-5 flex flex-col items-center">
          <button
            className="lg:hidden absolute top-4 right-4 text-outline hover:text-on-surface"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-card">
            {initials}
          </div>
          <p className="mt-3 text-sm font-semibold text-on-surface truncate max-w-[200px]">
            {displayName}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-xs text-on-surface-variant">${balance.toFixed(2)} Balance</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-on-primary shadow-card"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="my-3 border-t border-outline-variant/15" />
              {ADMIN_NAV_ITEMS.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-secondary text-on-secondary shadow-card"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4">
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error-container/30 transition-colors">
              <LogOut className="w-[18px] h-[18px]" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ============== MAIN ============== */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/80 backdrop-blur-lg ghost-border flex items-center px-4 lg:px-6 gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-container transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-on-surface-variant" />
          </button>

          {/* Account badges */}
          <div className="hidden sm:flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs font-medium text-on-surface-variant">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Account Status: <span className="text-on-surface font-semibold">{profile?.status || "Active"}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs font-medium text-on-surface-variant">
              ⭐ Account Points: <span className="text-on-surface font-semibold">{accountPoints} pts = ${(accountPoints * 0.01).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs font-medium text-on-surface-variant">
              💰 Account Spending: <span className="text-on-surface font-semibold">${totalSpent.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex-1 sm:flex-none" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-surface-container transition-colors">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-surface-container transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-on-surface">
                  {displayName.length > 10 ? displayName.slice(0, 10) + "..." : displayName}
                </span>
                <ChevronDown className="w-4 h-4 text-outline" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-2xl shadow-elevated py-2 z-50 animate-fade-in">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="my-1 border-outline-variant/15" />
                  <form action="/api/auth/signout" method="post">
                    <button type="submit" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/20 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
