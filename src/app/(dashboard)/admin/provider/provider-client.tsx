"use client";

import { useState } from "react";
import { testProviderConnection, getProviderBalance, updateAllPendingOrders } from "@/lib/actions/provider";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, DollarSign, Zap } from "lucide-react";

export default function ProviderClient() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balance, setBalance] = useState<any>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await testProviderConnection();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  const handleGetBalance = async () => {
    setLoadingBalance(true);
    setBalance(null);
    
    try {
      const result = await getProviderBalance();
      setBalance(result);
    } catch (error: any) {
      setBalance({ success: false, error: error.message });
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleUpdateOrders = async () => {
    setUpdating(true);
    setUpdateResult(null);
    
    try {
      const result = await updateAllPendingOrders();
      setUpdateResult(result);
    } catch (error: any) {
      setUpdateResult({ success: false, error: error.message });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Connection */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-bold text-on-surface mb-4">Test Provider Connection</h3>
        <p className="text-sm text-on-surface-variant mb-4">
          Verify that your provider API credentials are configured correctly.
        </p>
        
        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all shadow-card disabled:opacity-50"
        >
          {testing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Test Connection
            </>
          )}
        </button>

        {testResult && (
          <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${
            testResult.success 
              ? "bg-green-500/10 border border-green-500/20" 
              : "bg-red-500/10 border border-red-500/20"
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${testResult.success ? "text-green-500" : "text-red-500"}`}>
                {testResult.success ? "Connection Successful!" : "Connection Failed"}
              </p>
              {testResult.message && (
                <p className="text-sm text-on-surface-variant mt-1">{testResult.message}</p>
              )}
              {testResult.balance !== undefined && (
                <p className="text-sm text-on-surface-variant mt-1">
                  Balance: {testResult.currency} {testResult.balance}
                </p>
              )}
              {testResult.error && (
                <p className="text-sm text-red-500 mt-1">{testResult.error}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Provider Balance */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-bold text-on-surface mb-4">Provider Balance</h3>
        <p className="text-sm text-on-surface-variant mb-4">
          Check your current balance with the provider.
        </p>
        
        <button
          onClick={handleGetBalance}
          disabled={loadingBalance}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-on-secondary font-semibold hover:bg-secondary-container transition-all shadow-card disabled:opacity-50"
        >
          {loadingBalance ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <DollarSign className="w-5 h-5" />
              Get Balance
            </>
          )}
        </button>

        {balance && (
          <div className={`mt-4 p-4 rounded-xl ${
            balance.success 
              ? "bg-primary/10 border border-primary/20" 
              : "bg-red-500/10 border border-red-500/20"
          }`}>
            {balance.success ? (
              <div>
                <p className="text-sm text-on-surface-variant mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-primary">
                  {balance.currency || "$"} {balance.balance?.toFixed(2) || "0.00"}
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{balance.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update Orders */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-bold text-on-surface mb-4">Update Order Statuses</h3>
        <p className="text-sm text-on-surface-variant mb-4">
          Manually update all pending/processing orders from the provider. This is normally done automatically by a cron job.
        </p>
        
        <button
          onClick={handleUpdateOrders}
          disabled={updating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-tertiary text-on-tertiary font-semibold hover:bg-tertiary-container transition-all shadow-card disabled:opacity-50"
        >
          {updating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Update All Orders
            </>
          )}
        </button>

        {updateResult && (
          <div className={`mt-4 p-4 rounded-xl ${
            updateResult.success 
              ? "bg-green-500/10 border border-green-500/20" 
              : "bg-red-500/10 border border-red-500/20"
          }`}>
            {updateResult.success ? (
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-500">Update Complete</p>
                    <div className="text-sm text-on-surface-variant mt-2 space-y-1">
                      <p>Total orders: {updateResult.results?.total || 0}</p>
                      <p>Updated: {updateResult.results?.updated || 0}</p>
                      <p>Failed: {updateResult.results?.failed || 0}</p>
                    </div>
                  </div>
                </div>
                {updateResult.results?.errors?.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-surface-container">
                    <p className="text-xs font-medium text-on-surface mb-2">Errors:</p>
                    <div className="space-y-1">
                      {updateResult.results.errors.slice(0, 5).map((error: string, i: number) => (
                        <p key={i} className="text-xs text-on-surface-variant">{error}</p>
                      ))}
                      {updateResult.results.errors.length > 5 && (
                        <p className="text-xs text-on-surface-variant">
                          ... and {updateResult.results.errors.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{updateResult.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-on-surface mb-3">Configuration</h3>
        <div className="space-y-2 text-sm text-on-surface-variant">
          <p>
            <span className="font-medium text-on-surface">Provider API URL:</span>{" "}
            {process.env.NEXT_PUBLIC_PROVIDER_API_URL || "Not configured"}
          </p>
          <p>
            <span className="font-medium text-on-surface">Provider Name:</span>{" "}
            {process.env.NEXT_PUBLIC_PROVIDER_NAME || "Not configured"}
          </p>
          <p className="text-xs mt-3">
            Configure these in your <code className="px-2 py-1 rounded bg-surface-container">.env.local</code> file:
          </p>
          <pre className="mt-2 p-3 rounded-lg bg-surface-container text-xs overflow-x-auto">
{`PROVIDER_NAME=My SMM Provider
PROVIDER_API_URL=https://provider.example.com/api/v2
PROVIDER_API_KEY=your-api-key-here`}
          </pre>
        </div>
      </div>
    </div>
  );
}
