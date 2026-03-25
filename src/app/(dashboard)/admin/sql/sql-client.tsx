"use client";

import { useState } from "react";
import { Play, Download, Upload, FileText, Trash2 } from "lucide-react";

export default function SqlClient() {
  const [sqlQuery, setSqlQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predefinedQueries = [
    {
      name: "View All Users",
      query: "SELECT * FROM profiles ORDER BY created_at DESC LIMIT 50;",
    },
    {
      name: "View All Orders",
      query: "SELECT * FROM orders ORDER BY created_at DESC LIMIT 50;",
    },
    {
      name: "View All Services",
      query: "SELECT * FROM services ORDER BY id;",
    },
    {
      name: "View All Categories",
      query: "SELECT * FROM categories ORDER BY sort_order;",
    },
    {
      name: "View All Transactions",
      query: "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 50;",
    },
    {
      name: "Clear All Orders",
      query: "DELETE FROM orders;",
    },
  ];

  const handleExecute = async () => {
    if (!sqlQuery.trim()) {
      setError("Please enter a SQL query");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sqlQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute query");
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportSchema = () => {
    const link = document.createElement("a");
    link.href = "/supabase-schema.sql";
    link.download = "supabase-schema.sql";
    link.click();
  };

  const handleExportSeed = () => {
    const link = document.createElement("a");
    link.href = "/supabase-seed.sql";
    link.download = "supabase-seed.sql";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={handleExportSchema}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Schema SQL
        </button>
        <button
          onClick={handleExportSeed}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Seed SQL
        </button>
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/make-admin.sql";
            link.download = "make-admin.sql";
            link.click();
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <Download className="w-5 h-5 text-primary" />
          Download Make Admin SQL
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-bold text-on-surface mb-4">Predefined Queries</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {predefinedQueries.map((query, i) => (
            <button
              key={i}
              onClick={() => setSqlQuery(query.query)}
              className="px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-left"
            >
              <p className="font-medium text-on-surface text-sm">{query.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-on-surface">SQL Query Editor</h3>
          <button
            onClick={handleExecute}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {loading ? "Executing..." : "Execute"}
          </button>
        </div>

        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="w-full h-48 px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {results && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-on-surface-variant">
                {results.rowCount !== undefined
                  ? `${results.rowCount} row(s) affected`
                  : `${results.data?.length || 0} row(s) returned`}
              </p>
            </div>

            {results.data && results.data.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container">
                    <tr>
                      {Object.keys(results.data[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left text-xs font-medium text-on-surface-variant uppercase">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {results.data.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-surface-container transition-colors">
                        {Object.values(row).map((value: any, j: number) => (
                          <td key={j} className="px-4 py-2 text-on-surface">
                            {value === null ? (
                              <span className="text-on-surface-variant italic">null</span>
                            ) : typeof value === "object" ? (
                              JSON.stringify(value)
                            ) : (
                              String(value)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {results.data && results.data.length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-4">No results returned</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-sm text-on-surface-variant mb-4">
          These actions are irreversible. Use with caution. For complex queries, use Supabase SQL Editor directly.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete all orders? This cannot be undone!")) {
                setSqlQuery("DELETE FROM orders;");
              }
            }}
            className="w-full px-4 py-2 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            Clear All Orders
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete all transactions? This cannot be undone!")) {
                setSqlQuery("DELETE FROM transactions;");
              }
            }}
            className="w-full px-4 py-2 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            Clear All Transactions
          </button>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-primary mb-2">Note</h3>
        <p className="text-sm text-on-surface-variant">
          This SQL interface supports basic SELECT and DELETE queries. For complex operations like UPDATE, INSERT, or JOIN queries, please use the Supabase SQL Editor directly at your Supabase dashboard.
        </p>
      </div>
    </div>
  );
}
