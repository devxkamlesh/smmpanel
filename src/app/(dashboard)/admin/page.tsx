import { getAdminStats } from "@/lib/actions/admin";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Growth",
      value: "+12.5%",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface mb-2">Dashboard Overview</h2>
        <p className="text-on-surface-variant">Monitor your platform performance</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-2xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <h3 className="text-xl font-bold text-on-surface mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: "New user registered", time: "2 minutes ago" },
              { action: "Order #1234 completed", time: "5 minutes ago" },
              { action: "Payment received $50", time: "10 minutes ago" },
              { action: "Service updated", time: "15 minutes ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                <span className="text-sm text-on-surface">{activity.action}</span>
                <span className="text-xs text-on-surface-variant">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <h3 className="text-xl font-bold text-on-surface mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/users" className="block px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
              <p className="font-medium text-on-surface">Manage Users</p>
              <p className="text-sm text-on-surface-variant">View and edit user accounts</p>
            </a>
            <a href="/admin/services" className="block px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
              <p className="font-medium text-on-surface">Manage Services</p>
              <p className="text-sm text-on-surface-variant">Add or edit services</p>
            </a>
            <a href="/admin/sql" className="block px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
              <p className="font-medium text-on-surface">SQL Manager</p>
              <p className="text-sm text-on-surface-variant">Execute SQL queries</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
