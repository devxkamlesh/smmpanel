"use client";

import { useState, useEffect } from "react";
import { updateService, getServiceById } from "@/lib/actions/service-management";
import { X, Loader2, Save } from "lucide-react";
import type { Service, Category } from "@/types";

interface EditServiceModalProps {
  serviceId: number;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditServiceModal({
  serviceId,
  categories,
  onClose,
  onSuccess,
}: EditServiceModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [type, setType] = useState<"default" | "subscription" | "drip-feed">("default");
  const [rate, setRate] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [refill, setRefill] = useState(false);
  const [refillDays, setRefillDays] = useState("");
  const [averageTime, setAverageTime] = useState("");
  const [speed, setSpeed] = useState("");
  const [quality, setQuality] = useState("");
  const [country, setCountry] = useState("");
  const [providerServiceId, setProviderServiceId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    setLoading(true);
    try {
      const result = await getServiceById(serviceId);
      if (result.success && result.service) {
        const s = result.service;
        setName(s.name);
        setDescription(s.description || "");
        setCategoryId(s.category_id);
        setType(s.type);
        setRate(s.rate.toString());
        setMinQuantity(s.min_quantity.toString());
        setMaxQuantity(s.max_quantity.toString());
        setRefill(s.refill);
        setRefillDays(s.refill_days?.toString() || "");
        setAverageTime(s.average_time || "");
        setSpeed(s.speed || "");
        setQuality(s.quality || "");
        setCountry(s.country || "");
        setProviderServiceId(s.provider_service_id || "");
        setProviderId(s.provider_id?.toString() || "");
        setIsActive(s.is_active);
      } else {
        setError(result.error || "Failed to load service");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const result = await updateService(serviceId, {
        name,
        description: description || undefined,
        category_id: categoryId,
        type,
        rate: Number(rate),
        min_quantity: Number(minQuantity),
        max_quantity: Number(maxQuantity),
        refill,
        refill_days: refillDays ? Number(refillDays) : null,
        average_time: averageTime || undefined,
        speed: speed || undefined,
        quality: quality || undefined,
        country: country || undefined,
        provider_service_id: providerServiceId || undefined,
        provider_id: providerId ? Number(providerId) : null,
        is_active: isActive,
      });

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "Failed to update service");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <h2 className="text-2xl font-bold text-on-surface">Edit Service</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Service Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                />
              </div>

              {/* Pricing & Quantity */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Rate (per 1000) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Min Quantity <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Max Quantity <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                    required
                  />
                </div>
              </div>

              {/* Service Details */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                  >
                    <option value="default">Default</option>
                    <option value="subscription">Subscription</option>
                    <option value="drip-feed">Drip-feed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Average Time
                  </label>
                  <input
                    type="text"
                    value={averageTime}
                    onChange={(e) => setAverageTime(e.target.value)}
                    placeholder="e.g., 0-6 Hours"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Speed
                  </label>
                  <input
                    type="text"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="e.g., Fast"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Quality
                  </label>
                  <input
                    type="text"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    placeholder="e.g., High Quality"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., USA 🇺🇸"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                  />
                </div>
              </div>

              {/* Refill */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refill}
                    onChange={(e) => setRefill(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant/20"
                  />
                  <span className="text-sm font-medium text-on-surface">Refill Available</span>
                </label>

                {refill && (
                  <div className="flex-1">
                    <input
                      type="number"
                      value={refillDays}
                      onChange={(e) => setRefillDays(e.target.value)}
                      placeholder="Refill days"
                      className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                    />
                  </div>
                )}
              </div>

              {/* Provider Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Provider Service ID
                  </label>
                  <input
                    type="text"
                    value={providerServiceId}
                    onChange={(e) => setProviderServiceId(e.target.value)}
                    placeholder="External provider service ID"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Provider ID
                  </label>
                  <input
                    type="number"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    placeholder="Provider ID"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant/20"
                  />
                  <span className="text-sm font-medium text-on-surface">Service Active</span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-error-container/20 border border-error/20 text-error text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
