import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-4">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-on-surface-variant">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">1. Acceptance of Terms</h2>
              <p className="text-on-surface-variant leading-relaxed">
                By accessing and using SMM Panel, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">2. Service Description</h2>
              <p className="text-on-surface-variant leading-relaxed mb-3">
                SMM Panel provides social media marketing services including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>Social media followers, likes, views, and engagement</li>
                <li>Content promotion services</li>
                <li>Analytics and reporting tools</li>
                <li>API access for resellers</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">3. User Responsibilities</h2>
              <p className="text-on-surface-variant leading-relaxed mb-3">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use services in compliance with all applicable laws</li>
                <li>Not engage in fraudulent or abusive behavior</li>
                <li>Not resell services without proper authorization</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">4. Payment Terms</h2>
              <p className="text-on-surface-variant leading-relaxed">
                All payments are processed securely. Prices are subject to change without notice. Refunds are provided according to our refund policy. Users are responsible for any applicable taxes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">5. Service Guarantees</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We strive to provide high-quality services with instant delivery. However, delivery times may vary based on order volume and platform restrictions. Refill guarantees apply to eligible services as specified in service descriptions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">6. Limitation of Liability</h2>
              <p className="text-on-surface-variant leading-relaxed">
                SMM Panel shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. Our total liability shall not exceed the amount paid for the specific service in question.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">7. Account Termination</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse our services. Users may close their accounts at any time through the dashboard.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">8. Changes to Terms</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or dashboard notification. Continued use of services after changes constitutes acceptance of new terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">9. Contact Information</h2>
              <p className="text-on-surface-variant leading-relaxed">
                For questions about these terms, please contact us at support@smmpanel.com or through our support ticket system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
