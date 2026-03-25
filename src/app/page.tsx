"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Sparkles,
  TrendingUp,
  Shield,
  Rocket,
  Globe2,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Share2,
  Video,
  MessageCircle,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      <Navbar />

      {/* ============== HERO SECTION ============== */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tertiary/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Trusted by 50,000+ Users Worldwide</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-on-surface leading-tight tracking-tight">
              Supercharge Your
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
                Social Media Growth
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
              The most advanced SMM panel with instant delivery, premium quality services, and unbeatable prices. Scale your social presence effortlessly.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary text-base font-semibold hover:bg-primary-container transition-all shadow-card hover:shadow-elevated hover:scale-105"
              >
                Start Free Trial <Rocket className="w-5 h-5" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-surface-container text-on-surface text-base font-semibold hover:bg-surface-container-high transition-all ghost-border"
              >
                View Services <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: "1.2M+", label: "Orders Delivered" },
                { value: "50K+", label: "Active Users" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-surface-container-lowest rounded-2xl p-6 shadow-card"
                >
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== PLATFORMS SECTION ============== */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
              All Major Platforms <span className="text-secondary">Supported</span>
            </h2>
            <p className="mt-3 text-on-surface-variant">Grow your presence across every social network</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { icon: Share2, name: "Instagram", color: "from-pink-500 to-purple-500" },
              { icon: Video, name: "YouTube", color: "from-red-500 to-red-600" },
              { icon: MessageCircle, name: "Twitter", color: "from-blue-400 to-blue-500" },
              { icon: Globe2, name: "Facebook", color: "from-blue-600 to-blue-700" },
              { icon: Video, name: "TikTok", color: "from-black to-gray-800" },
              { icon: MessageCircle, name: "Telegram", color: "from-blue-500 to-blue-600" },
              { icon: Globe2, name: "Spotify", color: "from-green-500 to-green-600" },
              { icon: Globe2, name: "LinkedIn", color: "from-blue-700 to-blue-800" },
            ].map((platform, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-container-lowest rounded-2xl p-6 text-center hover:shadow-card transition-all hover:-translate-y-1 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-medium text-on-surface-variant">{platform.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FEATURES SECTION ============== */}
      <section id="features" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
              Why Choose <span className="text-primary">Our Platform</span>
            </h2>
            <p className="mt-3 text-on-surface-variant max-w-2xl mx-auto">
              Built for professionals who demand the best
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Instant Delivery",
                desc: "Orders start within 30 seconds. No waiting, no delays.",
                gradient: "from-primary to-primary-container",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "100% Secure",
                desc: "Bank-level encryption protects all your transactions.",
                gradient: "from-secondary to-secondary-container",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Real Growth",
                desc: "High-quality engagement from real, active accounts.",
                gradient: "from-tertiary to-tertiary-container",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Advanced Analytics",
                desc: "Track every metric with detailed reporting dashboard.",
                gradient: "from-primary-container to-secondary",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "24/7 Support",
                desc: "Expert team ready to help via live chat and tickets.",
                gradient: "from-secondary-container to-tertiary",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Auto Refill",
                desc: "Automatic refill guarantee on all eligible services.",
                gradient: "from-tertiary-container to-primary",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-surface-container-lowest rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== SERVICES SECTION ============== */}
      <section id="services" className="py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
              Popular <span className="text-secondary">Services</span>
            </h2>
            <p className="mt-3 text-on-surface-variant">Premium quality at unbeatable prices</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                platform: "Instagram",
                service: "Followers",
                price: "$0.25",
                per: "1000",
                features: ["Real Active Users", "Instant Start", "Refill Guarantee", "High Quality"],
                color: "from-pink-500 to-purple-500",
                popular: true,
              },
              {
                platform: "Instagram",
                service: "Likes",
                price: "$0.15",
                per: "1000",
                features: ["100% Real Accounts", "0-1 Hour Start", "365 Days Refill", "Brazil Premium"],
                color: "from-pink-500 to-purple-500",
              },
              {
                platform: "YouTube",
                service: "Views",
                price: "$0.50",
                per: "1000",
                features: ["70%+ Retention", "Real Traffic", "Fast Delivery", "Safe & Secure"],
                color: "from-red-500 to-red-600",
              },
              {
                platform: "TikTok",
                service: "Likes",
                price: "$0.10",
                per: "1000",
                features: ["Instant Start", "Real Users", "Fast Speed", "Cheap Price"],
                color: "from-black to-gray-800",
              },
              {
                platform: "Twitter",
                service: "Followers",
                price: "$0.30",
                per: "1000",
                features: ["Real Accounts", "Quick Start", "Refill Available", "Quality Users"],
                color: "from-blue-400 to-blue-500",
              },
              {
                platform: "Spotify",
                service: "Plays",
                price: "$0.05",
                per: "1000",
                features: ["Premium Quality", "Real Plays", "Fast Delivery", "Best Price"],
                color: "from-green-500 to-green-600",
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-surface-container-lowest rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 ${
                  service.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-on-surface">{service.platform} {service.service}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{service.price}</span>
                  <span className="text-sm text-on-surface-variant">per {service.per}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-6 block text-center px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-medium hover:bg-surface-container-high transition-all ghost-border"
                >
                  Order Now
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              href="/services-public"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all shadow-card"
            >
              View All Services <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============== PRICING SECTION ============== */}
      <section id="pricing" className="py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
              Lowest Prices <span className="text-secondary">Guaranteed</span>
            </h2>
            <p className="mt-3 text-on-surface-variant">No hidden fees. Pay only for what you use.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$10",
                features: ["100 Orders/month", "Basic Support", "All Platforms", "Standard Delivery"],
              },
              {
                name: "Professional",
                price: "$50",
                features: ["1000 Orders/month", "Priority Support", "All Platforms", "Fast Delivery", "API Access"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$200",
                features: ["Unlimited Orders", "24/7 Dedicated Support", "All Platforms", "Instant Delivery", "Full API Access", "Custom Solutions"],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-surface-container-lowest rounded-3xl p-8 shadow-card hover:shadow-elevated transition-all ${
                  plan.popular ? "ring-2 ring-primary scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-on-primary text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-on-surface">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-on-surface-variant">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 block text-center px-6 py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-primary text-on-primary hover:bg-primary-container shadow-card"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high ghost-border"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA SECTION ============== */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary">Join 50,000+ Happy Users</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-on-surface mb-6">
              Ready to Grow Your Social Media?
            </h2>
            <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
              Start your journey today with $5 free credit. No credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-primary text-on-primary text-lg font-semibold hover:bg-primary-container transition-all shadow-elevated hover:scale-105"
            >
              Create Free Account <Rocket className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
