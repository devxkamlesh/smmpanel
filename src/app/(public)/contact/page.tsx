import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg text-on-surface-variant">
            We're here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Email Support",
                desc: "support@smmpanel.com",
                action: "Send Email",
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "Live Chat",
                desc: "Available 24/7",
                action: "Start Chat",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Response Time",
                desc: "Usually within 1 hour",
                action: "Learn More",
              },
            ].map((item, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">{item.title}</h3>
                <p className="text-on-surface-variant mb-4">{item.desc}</p>
                <button className="text-sm text-primary font-medium hover:text-primary-container transition-colors">
                  {item.action} →
                </button>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container ghost-border text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container ghost-border text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container ghost-border text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container ghost-border text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all shadow-card"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
