import ProviderClient from "./provider-client";
import { Plug } from "lucide-react";

export default function AdminProviderPage() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Plug className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Provider Integration</h2>
          <p className="text-on-surface-variant">Manage external SMM provider connection</p>
        </div>
      </div>

      <ProviderClient />
    </div>
  );
}
