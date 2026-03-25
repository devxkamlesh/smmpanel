import { getAllServices } from "@/lib/actions/admin";
import ServicesClient from "./services-client";
import { Settings } from "lucide-react";

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-2">Service Management</h2>
          <p className="text-on-surface-variant">Manage all services and categories</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10">
          <Settings className="w-5 h-5 text-primary" />
          <span className="font-semibold text-primary">{services.length} Services</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        <ServicesClient services={services} />
      </div>
    </div>
  );
}
