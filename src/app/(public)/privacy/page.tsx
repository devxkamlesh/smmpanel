import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-4">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-on-surface-variant">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">1. Information We Collect</h2>
              <p className="text-on-surface-variant leading-relaxed mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>Account information (username, email, password)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Order history and service usage data</li>
                <li>Communication preferences and support tickets</li>
                <li>Device and browser information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">2. How We Use Your Information</h2>
              <p className="text-on-surface-variant leading-relaxed mb-3">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>Provide and maintain our services</li>
                <li>Process your orders and payments</li>
                <li>Send service updates and notifications</li>
                <li>Provide customer support</li>
                <li>Improve our platform and services</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">3. Information Sharing</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our platform, processing payments, or providing customer support. All third parties are bound by confidentiality agreements.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">4. Data Security</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">5. Cookies and Tracking</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We use cookies and similar tracking technologies to enhance user experience, analyze usage patterns, and maintain session information. You can control cookie preferences through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">6. Your Rights</h2>
              <p className="text-on-surface-variant leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">7. Data Retention</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide services. After account closure, we may retain certain information for legal compliance, fraud prevention, and dispute resolution.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">8. Children's Privacy</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Our services are not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">9. Changes to Privacy Policy</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We may update this privacy policy from time to time. We will notify users of significant changes via email or dashboard notification. Your continued use of services after changes constitutes acceptance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">10. Contact Us</h2>
              <p className="text-on-surface-variant leading-relaxed">
                For privacy-related questions or to exercise your rights, contact us at privacy@smmpanel.com or through our support system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
