"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createOrder } from "@/lib/actions/orders";
import { Service, Category, Platform } from "@/types";
import { Search, AlertCircle, CheckCircle2, Loader2, DollarSign, Package } from "lucide-react";

interface OrderFormProps {
  services: (Service & { category: Category })[];
  userBalance: number;
}

export default function OrderForm({ services, userBalance }: OrderFormProps) {
  const searchParams = useSearchParams();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [customComments, setCustomComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Calculate charge dynamically
  const charge = selectedService && quantity
    ? ((selectedService.rate * Number(quantity)) / 1000).toFixed(2)
    : "0.00";

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesPlatform = selectedPlatform === "all" || service.category.platform === selectedPlatform;
    const matchesCategory = !selectedCategory || service.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesCategory && matchesSearch && service.is_active;
  });

  // Get unique platforms
  const platforms = Array.from(new Set(services.map(s => s.category.platform)));

  // Get categories for selected platform
  const categories = Array.from(
    new Map(
      services
        .filter(s => selectedPlatform === "all" || s.category.platform === selectedPlatform)
        .map(s => [s.category.id, s.category])
    ).values()
  );

  // Pre-select service from URL parameter
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      const serviceId = parseInt(serviceParam);
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setSelectedPlatform(service.category.platform);
        setSelectedCategory(service.category_id);
      }
    }
  }, [searchParams, services]);

  // Auto-increment quantity based on custom comments lines
  useEffect(() => {
    if (selectedService?.features?.custom_comments && customComments) {
      const lines = customComments.split('\n').filter(line => line.trim() !== '');
      setQuantity(lines.length.toString());
    }
  }, [customComments, selectedService]);

  // Reset selections when platform changes
  useEffect(() => {
    setSelectedCategory(null);
    setSelectedService(null);
  }, [selectedPlatform]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      setError("Please select a service");
      return;
    }

    if (!link.trim()) {
      setError("Please enter a link");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await createOrder(
        selectedService.id, 
        link, 
        Number(quantity),
        selectedService.features?.custom_comments ? customComments : undefined
      );

      if (result.success) {
        setSuccess(result.message || "Order placed successfully!");
        setLink("");
        setQuantity("");
        setCustomComments("");
        setSelectedService(null);
      } else {
        setError(result.error || "Failed to create order");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left: Service Selection */}
      <div className="lg:col-span-2 space-y-6">
        {/* Platform Filter */}
        <div className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card">
          <h3 className="text-base md:text-lg font-bold text-on-surface mb-3 md:mb-4">Select Platform</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPlatform("all")}
              className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all ${
                selectedPlatform === "all"
                  ? "bg-primary text-on-primary shadow-card"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              All
            </button>
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all capitalize ${
                  selectedPlatform === platform
                    ? "bg-primary text-on-primary shadow-card"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {platform.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card">
            <h3 className="text-base md:text-lg font-bold text-on-surface mb-3 md:mb-4">Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-left px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary text-on-primary shadow-card"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Service List */}
        <div className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-on-surface">Services</h3>
            <span className="text-xs md:text-sm text-on-surface-variant bg-surface-container px-2 md:px-3 py-1 rounded-full">
              {filteredServices.length}
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-3 md:mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Services */}
          <div className="space-y-2 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-1">
            {filteredServices.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`w-full text-left p-3 md:p-4 rounded-lg md:rounded-xl transition-all ${
                  selectedService?.id === service.id
                    ? "bg-primary text-on-primary shadow-card"
                    : "bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <div className="flex items-start justify-between gap-2 md:gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm md:text-base mb-1 ${
                      selectedService?.id === service.id ? "text-on-primary" : "text-on-surface"
                    }`}>
                      {service.name}
                    </p>
                    {service.description && (
                      <p className={`text-xs line-clamp-1 ${
                        selectedService?.id === service.id ? "text-on-primary/80" : "text-on-surface-variant"
                      }`}>
                        {service.description}
                      </p>
                    )}
                    <div className={`flex flex-wrap items-center gap-2 md:gap-3 mt-1.5 md:mt-2 text-xs ${
                      selectedService?.id === service.id ? "text-on-primary/80" : "text-on-surface-variant"
                    }`}>
                      <span>Min: {service.min_quantity}</span>
                      <span>•</span>
                      <span>Max: {service.max_quantity}</span>
                      {service.average_time && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">⏱ {service.average_time}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-base md:text-lg font-bold ${
                      selectedService?.id === service.id ? "text-on-primary" : "text-primary"
                    }`}>
                      ${Number(service.rate).toFixed(2)}
                    </p>
                    <p className={`text-xs ${
                      selectedService?.id === service.id ? "text-on-primary/80" : "text-on-surface-variant"
                    }`}>
                      /1k
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {filteredServices.length === 0 && (
              <div className="text-center py-8 md:py-12 text-on-surface-variant">
                <Package className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm md:text-base">No services found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Order Form */}
      <div className="space-y-4 md:space-y-6 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card text-on-primary">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 md:w-5 h-4 md:h-5" />
            <p className="text-xs md:text-sm font-medium opacity-90">Balance</p>
          </div>
          <p className="text-2xl md:text-3xl font-bold">${userBalance.toFixed(2)}</p>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card space-y-4">
          <h3 className="text-base md:text-lg font-bold text-on-surface mb-3 md:mb-4">Place Order</h3>

          {/* Selected Service */}
          {selectedService && (
            <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs text-on-surface-variant mb-1">Selected Service</p>
              <p className="font-medium text-sm md:text-base text-on-surface line-clamp-2">{selectedService.name}</p>
              <p className="text-xs text-on-surface-variant mt-1">
                ${Number(selectedService.rate).toFixed(2)} per 1000
              </p>
            </div>
          )}

          {/* Link Input */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-on-surface mb-2">
              Link <span className="text-error">*</span>
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Custom Comments (if service supports it) */}
          {selectedService?.features?.custom_comments && (
            <div>
              <label className="block text-xs md:text-sm font-medium text-on-surface mb-2">
                Custom Comments <span className="text-error">*</span>
              </label>
              <textarea
                value={customComments}
                onChange={(e) => setCustomComments(e.target.value)}
                placeholder="Enter one comment per line..."
                rows={5}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
              <p className="text-xs text-on-surface-variant mt-1">
                One comment per line. Quantity auto-updates.
              </p>
            </div>
          )}

          {/* Quantity Input */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-on-surface mb-2">
              Quantity <span className="text-error">*</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={selectedService ? `${selectedService.min_quantity} - ${selectedService.max_quantity}` : "Enter quantity"}
              min={selectedService?.min_quantity}
              max={selectedService?.max_quantity}
              disabled={selectedService?.features?.custom_comments && customComments !== ""}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            {selectedService && (
              <p className="text-xs text-on-surface-variant mt-1">
                Min: {selectedService.min_quantity} | Max: {selectedService.max_quantity}
              </p>
            )}
          </div>

          {/* Charge Display */}
          <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-on-surface-variant">Total</span>
              <span className="text-xl md:text-2xl font-bold text-primary">${charge}</span>
            </div>
          </div>

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
            disabled={loading || !selectedService || Number(charge) > userBalance}
            className="w-full px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-primary text-on-primary text-sm md:text-base font-semibold hover:bg-primary-container transition-all shadow-card disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>

          {Number(charge) > userBalance && (
            <p className="text-xs text-error text-center">
              Insufficient balance. Please add funds.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
