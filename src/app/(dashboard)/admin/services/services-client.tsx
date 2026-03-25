"use client";

import { useState } from "react";
import { Service, Category } from "@/types";
import { toggleServiceStatus, deleteService } from "@/lib/actions/admin";
import { 
  duplicateService, 
  bulkUpdateServices, 
  bulkUpdateRatesByPercentage,
  createService 
} from "@/lib/actions/service-management";
import { 
  Trash2, 
  Eye, 
  EyeOff, 
  Edit, 
  Copy, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  CheckSquare,
  Square
} from "lucide-react";
import EditServiceModal from "./edit-service-modal";
import CreateServiceModal from "./create-service-modal";

export default function ServicesClient({ services }: { services: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async (serviceId: number, currentStatus: boolean) => {
    setLoading(true);
    try {
      await toggleServiceStatus(serviceId, !currentStatus);
      window.location.reload();
    } catch (error) {
      alert("Failed to update service status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    setLoading(true);
    try {
      await deleteService(serviceId);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-surface-container-low">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Service Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Rate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Min/Max</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                #{service.id}
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-on-surface">{service.name}</p>
                {service.description && (
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{service.description}</p>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {service.category?.name || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                ${Number(service.rate).toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                {service.min_quantity} - {service.max_quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleStatus(service.id, service.is_active)}
                  disabled={loading}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    service.is_active
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {service.is_active ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(service.id, service.is_active)}
                    disabled={loading}
                    className="p-2 rounded-lg hover:bg-surface-container transition-colors"
                    title={service.is_active ? "Deactivate" : "Activate"}
                  >
                    {service.is_active ? (
                      <EyeOff className="w-4 h-4 text-on-surface-variant" />
                    ) : (
                      <Eye className="w-4 h-4 text-on-surface-variant" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    disabled={loading}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
