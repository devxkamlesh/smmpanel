import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Database, Settings, BarChart3, Plug, Receipt } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const tabs = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Services", href: "/admin/services", icon: Settings },
    { name: "Transactions", href: "/admin/transactions", icon: Receipt },
    { name: "Provider", href: "/admin/provider", icon: Plug },
    { name: "SQL Manager", href: "/admin/sql", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-on-surface">Admin Panel</h1>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap"
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
