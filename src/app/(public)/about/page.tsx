import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Users, Target, Award, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-6 text-center">
            About <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg text-on-surface-variant text-center">
            We're on a mission to democratize social media growth for everyone.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-on-surface mb-4">Our Story</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                Founded in 2020, SMM Panel has grown to become one of the world's most trusted social media marketing platforms. We started with a simple vision: to make high-quality social media growth accessible to everyone, from individual creators to large enterprises.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                Today, we serve over 50,000 active users worldwide, processing more than 1.2 million orders with a 99.9% uptime guarantee. Our commitment to quality, speed, and customer satisfaction has made us the go-to choice for social media professionals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "50,000+ Users",
                  desc: "Trusted by creators worldwide",
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "1.2M+ Orders",
                  desc: "Successfully delivered",
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: "99.9% Uptime",
                  desc: "Always available when you need us",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "24/7 Support",
                  desc: "Expert help anytime",
                },
              ].map((stat, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">{stat.title}</h3>
                  <p className="text-on-surface-variant">{stat.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-on-surface mb-4">Our Values</h2>
              <ul className="space-y-3 text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-on-surface">Quality First:</strong> We never compromise on the quality of our services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-on-surface">Customer Success:</strong> Your growth is our success.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-on-surface">Innovation:</strong> We constantly improve our platform and services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-on-surface">Transparency:</strong> Honest pricing, no hidden fees.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
