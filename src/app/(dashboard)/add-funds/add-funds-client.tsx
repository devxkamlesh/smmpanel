"use client";

import { useState } from "react";
import { requestFunds } from "@/lib/actions/wallet";
import { Wallet, DollarSign, CreditCard, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface AddFundsClientProps {
  userBalance: number;
}

export default function AddFundsClient({ userBalance }: AddFundsClientProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await requestFunds(
        Number(amount),
        paymentMethod,
        paymentDetails
      );

      if (result.success) {
        setSuccess(result.message || "Request submitted successfully!");
        setAmount("");
        setPaymentDetails("");
      } else {
        setError(result.error || "Failed to submit request");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_350px] gap-4 md:gap-6">
      {/* Left: Add Funds Form */}
      <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
        {/* Current Balance */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card text-on-primary">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 md:w-5 h-4 md:h-5" />
            <p className="text-xs md:text-sm font-medium opacity-90">Current Balance</p>
          </div>
          <p className="text-3xl md:text-4xl font-bold">${userBalance.toFixed(2)}</p>
        </div>

        {/* Add Funds Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card space-y-4 md:space-y-6">
          <h3 className="text-base md:text-xl font-bold text-on-surface">Add Funds</h3>

          {/* Quick Amount Selection */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-on-surface mb-2 md:mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(String(quickAmount))}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all ${
                    amount === String(quickAmount)
                      ? "bg-primary text-on-primary shadow-card"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-on-surface mb-2">
              Amount (USD) <span className="text-error">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-on-surface-variant" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="5"
                max="10000"
                step="0.01"
                className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Min: $5 | Max: $10,000
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-on-surface mb-2">
              Payment Method <span className="text-error">*</span>
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="paytm">Paytm</option>
              <option value="phonepe">PhonePe</option>
              <option value="gpay">Google Pay</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Payment Details */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-on-surface mb-2">
              Payment Details / Transaction ID <span className="text-error">*</span>
            </label>
            <textarea
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              placeholder="Enter transaction ID, reference number, or payment proof details"
              rows={3}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
            <p className="text-xs text-on-surface-variant mt-1">
              Provide transaction ID or payment proof for verification
            </p>
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
            disabled={loading}
            className="w-full px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-primary text-on-primary text-sm md:text-base font-semibold hover:bg-primary-container transition-all shadow-card disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CreditCard className="w-4 md:w-5 h-4 md:h-5" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right: Instructions */}
      <div className="space-y-4 md:space-y-6 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
        <div className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card">
          <h3 className="text-base md:text-lg font-bold text-on-surface mb-3 md:mb-4">How to Add Funds</h3>
          <div className="space-y-3 text-xs md:text-sm text-on-surface-variant">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p>Select or enter the amount you want to add</p>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p>Choose your preferred payment method</p>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p>Make payment using provided details</p>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">4</span>
              </div>
              <p>Enter transaction ID or payment proof</p>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">5</span>
              </div>
              <p>Submit request and wait for admin approval</p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-on-surface mb-3">Important Notes</h3>
          <ul className="space-y-2 text-xs md:text-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Minimum deposit: $5</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Maximum deposit: $10,000</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Approval time: Usually within 1-24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Provide accurate payment details for faster approval</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Contact support if not approved within 24 hours</span>
            </li>
          </ul>
        </div>

        <div className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card">
          <h3 className="text-base md:text-lg font-bold text-on-surface mb-3">Need Help?</h3>
          <p className="text-xs md:text-sm text-on-surface-variant mb-4">
            Contact our support team for payment assistance
          </p>
          <a
            href="/tickets"
            className="block text-center px-4 py-2 rounded-lg md:rounded-xl bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-all"
          >
            Create Support Ticket
          </a>
        </div>
      </div>
    </div>
  );
}
