import SqlClient from "./sql-client";
import { Database, AlertTriangle } from "lucide-react";

export default function AdminSqlPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-on-surface">SQL Manager</h2>
        </div>
        <p className="text-on-surface-variant">Execute SQL queries and manage database files</p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-500 mb-1">Warning</p>
          <p className="text-sm text-on-surface-variant">
            Direct SQL execution can modify or delete data permanently. Always backup your database before running destructive queries.
          </p>
        </div>
      </div>

      <SqlClient />
    </div>
  );
}
