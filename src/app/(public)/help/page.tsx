import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Search, MessageCircle, Book, Mail, ArrowRight } from "lucide-react";

export default function HelpPage() {
  const helpTopics = [
    {
      icon: <Book className="w-6 h-6" />,
      title: "Getting Started",
      desc: "Learn the basics of using our platform",
      link: "/faq",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "FAQ",
      desc: "Find answers to common questions",
      link: "/faq",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Contact Support",
      desc: "Get help from our support team",
      link: "/contact",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-6">
            Help <span className="text-primary">Center</span>
          </h1>
          <p className="text-lg text-on-surface-variant mb-8">
            Find answers, guides, and support resources
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {helpTopics.map((topic, i) => (
              <Link
                key={i}
                href={topic.link}
                className="bg-surface-container-lowest rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {topic.icon}
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">{topic.title}</h3>
                <p className="text-on-surface-variant mb-4">{topic.desc}</p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Popular Articles</h2>
            <div className="space-y-4">
              {[
                "How to place your first order",
                "Understanding service delivery times",
                "Payment methods and security",
                "Refill and refund policies",
                "API integration guide",
                "Account security best practices",
              ].map((article, i) => (
                <Link
                  key={i}
                  href="/faq"
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container transition-colors group"
                >
                  <span className="text-on-surface group-hover:text-primary transition-colors">{article}</span>
                  <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
