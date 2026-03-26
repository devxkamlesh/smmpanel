"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface-container-lowest/95 backdrop-blur-lg border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 md:w-9 h-8 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-card">
              <Zap className="w-4 md:w-5 h-4 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-on-surface">
              SMM<span className="text-primary">Panel</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/#features" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Pricing
            </Link>
            <Link href="/services-public" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Services
            </Link>
            <Link href="/docs" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Docs
            </Link>
            <Link href="/contact" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-primary hover:text-primary-container transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-all shadow-card hover:shadow-elevated"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-surface-container transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/10 bg-surface-container-lowest">
          <div className="px-4 py-3 space-y-1">
            <Link 
              href="/#features" 
              className="block px-3 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container active:bg-surface-container-high transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#pricing" 
              className="block px-3 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container active:bg-surface-container-high transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/services-public" 
              className="block px-3 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container active:bg-surface-container-high transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/docs" 
              className="block px-3 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container active:bg-surface-container-high transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 text-sm text-on-surface-variant rounded-lg hover:bg-surface-container active:bg-surface-container-high transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="pt-3 mt-3 border-t border-outline-variant/10 space-y-2">
              <Link 
                href="/login" 
                className="block text-center px-3 py-2 text-sm font-medium text-primary rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="block text-center px-3 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-card"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
