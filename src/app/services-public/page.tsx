import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle2, ArrowRight, Share2 } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      platform: "Instagram",
      items: [
        { name: "Followers - Real Active", price: "$0.25", per: "1K", features: ["Instant Start", "Refill 180 Days"] },
        { name: "Likes - Premium Quality", price: "$0.15", per: "1K", features: ["Real Accounts", "Refill 365 Days"] },
        { name: "Views - Story/Reel", price: "$0.10", per: "1K", features: ["Fast Delivery", "High Quality"] },
        { name: "Comments - Custom", price: "$2.50", per: "100", features: ["Real Users", "Custom Text"] },
      ],
      color: "from-pink-500 to-purple-500",
    },
    {
      platform: "YouTube",
      items: [
        { name: "Views - High Retention", price: "$0.50", per: "1K", features: ["70%+ Retention", "Real Traffic"] },
        { name: "Subscribers - Real", price: "$2.50", per: "100", features: ["Active Users", "Refill 180 Days"] },
        { name: "Likes", price: "$0.80", per: "1K", features: ["Fast Start", "Safe Method"] },
        { name: "Comments", price: "$3.00", per: "100", features: ["Real Comments", "Custom Text"] },
      ],
      color: "from-red-500 to-red-600",
    },
    {
      platform: "TikTok",
      items: [
        { name: "Followers - Real", price: "$0.40", per: "1K", features: ["Real Users", "Refill 90 Days"] },
        { name: "Likes - Instant", price: "$0.10", per: "1K", features: ["Instant Start", "Fast Speed"] },
        { name: "Views - High Quality", price: "$0.05", per: "1K", features: ["Real Views", "Very Fast"] },
        { name: "Shares", price: "$1.50", per: "1K", features: ["Real Shares", "Quick Delivery"] },
      ],
      color: "from-black to-gray-800",
    },
    {
      platform: "Twitter",
      items: [
        { name: "Followers - Real", price: "$0.30", per: "1K", features: ["Active Accounts", "Refill 120 Days"] },
        { name: "Likes", price: "$0.25", per: "1K", features: ["Fast Start", "Real Users"] },
        { name: "Retweets", price: "$0.50", per: "1K", features: ["Real Retweets", "Quick"] },
        { name: "Views", price: "$0.15", per: "1K", features: ["High Quality", "Fast"] },
      ],
      color: "from-blue-400 to-blue-500",
    },
    {
      platform: "Facebook",
      items: [
        { name: "Page Likes - Worldwide", price: "$0.90", per: "1K", features: ["Real Users", "Refill 90 Days"] },
        { name: "Post Likes", price: "$0.50", per: "1K", features: ["Fast Delivery", "Safe"] },
        { name: "Followers", price: "$0.80", per: "1K", features: ["Real Accounts", "Quality"] },
        { name: "Shares", price: "$1.20", per: "1K", features: ["Real Shares", "Quick"] },
      ],
      color: "from-blue-600 to-blue-700",
    },
    {
      platform: "Spotify",
      items: [
        { name: "Plays - Premium", price: "$0.05", per: "1K", features: ["Real Plays", "Fast Delivery"] },
        { name: "Followers", price: "$1.50", per: "1K", features: ["Real Users", "Refill 90 Days"] },
        { name: "Monthly Listeners", price: "$2.00", per: "1K", features: ["High Quality", "Safe"] },
        { name: "Saves", price: "$1.80", per: "1K", features: ["Real Saves", "Quick"] },
      ],
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-4">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Premium quality SMM services at the lowest prices. All services include instant delivery and 24/7 support.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((category, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-on-surface">{category.platform}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((service, i) => (
                    <div
                      key={i}
                      className="bg-surface-container-lowest rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1"
                    >
                      <h3 className="font-semibold text-on-surface mb-3">{service.name}</h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-primary">{service.price}</span>
                        <span className="text-sm text-on-surface-variant">per {service.per}</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {service.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/register"
                        className="block text-center px-4 py-2 rounded-lg bg-surface-container text-on-surface font-medium hover:bg-surface-container-high transition-all ghost-border text-sm"
                      >
                        Order Now
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-surface-container-lowest rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-on-surface mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-on-surface-variant mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and start growing your social media presence today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all shadow-card"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
