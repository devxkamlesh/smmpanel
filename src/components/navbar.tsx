"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Zap, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass ghost-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-card">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-on-surface">
              SMM<span className="text-primary">Panel</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Pricing
            </Link>
            <Link href="/services-public" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Contact
            </Link>
            <Link href="/login" className="text-sm font-medium text-primary hover:text-primary-container transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-all shadow-card hover:shadow-elevated"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-outline-variant/15 bg-surface-container-lowest p-4 space-y-2"
        >
          <Link href="/#features" className="block px-4 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container">Features</Link>
          <Link href="/#pricing" className="block px-4 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container">Pricing</Link>
          <Link href="/services-public" className="block px-4 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container">Services</Link>
          <Link href="/about" className="block px-4 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container">About</Link>
          <Link href="/contact" className="block px-4 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container">Contact</Link>
          <Link href="/login" className="block px-4 py-2 text-sm font-medium text-primary rounded-lg hover:bg-surface-container">Sign in</Link>
          <Link href="/register" className="block text-center px-4 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold">
            Get Started
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
