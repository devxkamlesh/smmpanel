import Link from "next/link";
import { Book, FileText, Code, Shield, HelpCircle, Zap } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn the basics and create your first order",
      icon: Zap,
      href: "/docs/getting-started",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "User Guide",
      description: "Complete guide to all platform features",
      icon: Book,
      href: "/docs/user-guide",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "API Documentation",
      description: "Integrate with our RESTful API",
      icon: Code,
      href: "/docs/api",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Admin Guide",
      description: "Manage services, users, and settings",
      icon: Shield,
      href: "/docs/admin",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "FAQ",
      description: "Frequently asked questions",
      icon: HelpCircle,
      href: "/docs/faq",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Changelog",
      description: "Latest updates and features",
      icon: FileText,
      href: "/docs/changelog",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-surface py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">
            Documentation
          </h1>
          <p className="text-base md:text-xl text-on-surface-variant max-w-2xl mx-auto">
            Everything you need to know about using SMM Panel
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary shadow-card"
            />
            <button className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-surface-container-lowest rounded-xl md:rounded-2xl p-6 md:p-8 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1"
            >
              <div className={`w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                <section.icon className="w-6 md:w-7 h-6 md:h-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-on-surface mb-2">
                {section.title}
              </h3>
              <p className="text-sm md:text-base text-on-surface-variant">
                {section.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 md:mt-16 bg-surface-container-lowest rounded-xl md:rounded-2xl p-6 md:p-8 shadow-card">
          <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-6">Quick Links</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/docs/getting-started#creating-account" className="text-sm md:text-base text-primary hover:text-primary-container transition-colors">
              → How to create an account
            </Link>
            <Link href="/docs/user-guide#placing-orders" className="text-sm md:text-base text-primary hover:text-primary-container transition-colors">
              → How to place an order
            </Link>
            <Link href="/docs/user-guide#adding-funds" className="text-sm md:text-base text-primary hover:text-primary-container transition-colors">
              → How to add funds
            </Link>
            <Link href="/docs/api#authentication" className="text-sm md:text-base text-primary hover:text-primary-container transition-colors">
              → API authentication
            </Link>
            <Link href="/docs/user-guide#mass-orders" className="text-sm md:text-base text-primary hover:text-primary-container transition-colors">
              → Mass order guide
            </Link>
            <Link href="/docs/faq" className="text-sm md:text-base text-primary hover:text-primary-container transition-colors">
              → Common questions
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-sm md:text-base text-on-surface-variant mb-4">
            Can't find what you're looking for?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-primary text-on-primary text-sm md:text-base font-semibold hover:bg-primary-container transition-all shadow-card hover:shadow-elevated"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
