import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function StatusPage() {
  const services = [
    { name: "API Services", status: "operational", uptime: "99.99%" },
    { name: "Order Processing", status: "operational", uptime: "99.98%" },
    { name: "Payment Gateway", status: "operational", uptime: "99.97%" },
    { name: "Instagram Services", status: "operational", uptime: "99.95%" },
    { name: "YouTube Services", status: "operational", uptime: "99.96%" },
    { name: "TikTok Services", status: "operational", uptime: "99.94%" },
    { name: "Twitter Services", status: "operational", uptime: "99.93%" },
    { name: "Facebook Services", status: "operational", uptime: "99.92%" },
  ];

  const incidents = [
    {
      date: "March 20, 2026",
      title: "Scheduled Maintenance",
      status: "resolved",
      desc: "Routine database optimization completed successfully.",
    },
    {
      date: "March 15, 2026",
      title: "Instagram API Update",
      status: "resolved",
      desc: "Updated Instagram services to support latest API changes.",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-green-500">All Systems Operational</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-4">
            System <span className="text-primary">Status</span>
          </h1>
          <p className="text-lg text-on-surface-variant">
            Real-time status of our services and infrastructure
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Current Status</h2>
            <div className="space-y-4">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-container"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-on-surface">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-on-surface-variant">Uptime: {service.uptime}</span>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                      Operational
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident, i) => (
                <div key={i} className="p-6 rounded-xl bg-surface-container">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-on-surface">{incident.title}</h3>
                        <p className="text-sm text-on-surface-variant mt-1">{incident.date}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                      Resolved
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant ml-8">{incident.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-on-surface mb-1">Subscribe to Updates</h3>
                <p className="text-sm text-on-surface-variant">
                  Get notified about service updates and incidents via email or SMS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
