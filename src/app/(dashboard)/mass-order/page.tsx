"use client";

import { useState } from "react";
import { Layers, Upload, AlertCircle, CheckCircle2, Loader2, FileText, Info } from "lucide-react";

export default function MassOrderPage() {
  const [orders, setOrders] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess("Mass order submitted successfully! Processing orders...");
      setOrders("");
    }, 2000);
  };

  const lineCount = orders.split('\n').filter(line => line.trim()).length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Layers className="w-5 md:w-6 h-5 md:h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Mass Order</h1>
          <p className="text-sm md:text-base text-on-surface-variant">Submit multiple orders at once</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-4 md:gap-6">
        {/* Left: Form */}
        <div className="space-y-4 md:space-y-6">
          {/* Instructions */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-on-surface mb-2">Format Instructions</h3>
                <p className="text-sm text-on-surface-variant mb-3">
                  Enter one order per line in the following format:
                </p>
                <code className="block px-3 py-2 rounded-lg bg-surface-container text-primary text-xs md:text-sm font-mono">
                  service_id | link | quantity
                </code>
                <p className="text-xs text-on-surface-variant mt-3">
                  Example: <span className="text-on-surface font-medium">12841 | https://instagram.com/p/example | 1000</span>
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm md:text-base font-bold text-on-surface">
                Orders <span className="text-error">*</span>
              </label>
              {lineCount > 0 && (
                <span className="text-xs md:text-sm text-on-surface-variant bg-surface-container px-2 md:px-3 py-1 rounded-full">
                  {lineCount} {lineCount === 1 ? 'order' : 'orders'}
                </span>
              )}
            </div>

            <textarea
              value={orders}
              onChange={(e) => setOrders(e.target.value)}
              placeholder="12841 | https://instagram.com/p/example | 1000&#10;12842 | https://instagram.com/p/example2 | 500&#10;12843 | https://instagram.com/p/example3 | 2000"
              rows={12}
              className="w-full px-3 md:px-4 py-3 rounded-lg md:rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface text-xs md:text-sm font-mono placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 md:p-4 rounded-lg md:rounded-xl bg-error-container/20 border border-error/20">
                <AlertCircle className="w-4 md:w-5 h-4 md:h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-error">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-2 p-3 md:p-4 rounded-lg md:rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-green-500">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !orders.trim()}
              className="w-full px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-primary text-on-primary text-sm md:text-base font-semibold hover:bg-primary-container transition-all shadow-card disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 md:w-5 h-4 md:h-5" />
                  Submit Mass Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Info & Tips */}
        <div className="space-y-4 md:space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Tips */}
          <div className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-base md:text-lg font-bold text-on-surface">Tips</h3>
            </div>
            <ul className="space-y-3 text-xs md:text-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Use the pipe character (|) to separate fields</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Service ID must be a valid active service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Link must be a valid URL for the service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Quantity must be within service min/max limits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Empty lines will be ignored</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>All orders will be charged from your balance</span>
              </li>
            </ul>
          </div>

          {/* Example */}
          <div className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card">
            <h3 className="text-base md:text-lg font-bold text-on-surface mb-3">Example</h3>
            <div className="bg-surface-container rounded-lg p-3 md:p-4">
              <code className="text-xs md:text-sm font-mono text-on-surface block space-y-1">
                <div className="text-on-surface-variant">// Instagram Likes</div>
                <div>12841 | https://instagram.com/p/abc123 | 1000</div>
                <div className="mt-2 text-on-surface-variant">// Instagram Followers</div>
                <div>12842 | https://instagram.com/username | 500</div>
                <div className="mt-2 text-on-surface-variant">// YouTube Views</div>
                <div>12843 | https://youtube.com/watch?v=xyz | 2000</div>
              </code>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-error-container/10 border border-error/20 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-error mb-2 text-sm md:text-base">Important</h3>
                <p className="text-xs md:text-sm text-on-surface-variant">
                  Make sure you have sufficient balance before submitting. Invalid orders will be skipped and you'll be notified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
