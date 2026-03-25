"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, Eye, EyeOff, Mail, Lock, User, Hash } from "lucide-react";
import { signUp } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/5 flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center shadow-card">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-on-surface">
            SMM<span className="text-primary">Panel</span>
          </span>
        </Link>

        {/* Register Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-elevated p-6 backdrop-blur-sm">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-on-surface">Create Account</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">Start your growth journey today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/20 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-on-surface mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="username"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container ghost-border text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container ghost-border text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-surface-container ghost-border text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface mb-1.5">
                Referral Code <span className="text-outline text-[10px]">(optional)</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  name="referral"
                  placeholder="Enter code"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container ghost-border text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="w-3.5 h-3.5 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary" />
              <span className="text-[11px] text-on-surface-variant leading-tight">
                I agree to the{" "}
                <Link href="/terms" className="text-primary font-medium hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all shadow-card disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-[10px] text-outline font-medium">OR</span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          <button className="mt-3 w-full py-2.5 rounded-lg bg-surface-container text-on-surface font-medium ghost-border hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 text-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <p className="mt-4 text-center text-xs text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary-container">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-3 text-center text-[10px] text-on-surface-variant">
          <Link href="/terms" className="hover:text-on-surface">Terms</Link>
          <span className="mx-1.5">•</span>
          <Link href="/privacy" className="hover:text-on-surface">Privacy</Link>
          <span className="mx-1.5">•</span>
          <Link href="/contact" className="hover:text-on-surface">Contact</Link>
        </div>
      </div>
    </div>
  );
}
