"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is an SMM Panel?",
      answer: "An SMM (Social Media Marketing) Panel is a platform that provides social media marketing services such as followers, likes, views, and engagement across various social media platforms. Our panel offers instant delivery, competitive pricing, and 24/7 support.",
    },
    {
      question: "How do I place an order?",
      answer: "Simply create an account, add funds to your balance, select the service you want, enter the required details (like your social media link), choose the quantity, and submit your order. Most orders start within 30 seconds.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, PayPal, cryptocurrency, and other popular payment gateways. All transactions are processed securely through encrypted connections.",
    },
    {
      question: "How long does delivery take?",
      answer: "Most services start within 30 seconds to 1 hour. Delivery time varies by service and order size. You can check the estimated delivery time in each service description. We guarantee fast and reliable delivery.",
    },
    {
      question: "Do you offer refills?",
      answer: "Yes! Many of our services come with automatic refill guarantees ranging from 30 to 365 days. If you experience any drop in numbers during the refill period, we'll automatically refill your order at no extra cost.",
    },
    {
      question: "Is it safe to use your services?",
      answer: "Absolutely! We use only safe and proven methods that comply with platform guidelines. Our services are designed to look natural and organic. We've been in business for years with thousands of satisfied customers.",
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled if they haven't started processing yet. Once an order is in progress, it cannot be cancelled. However, if there's an issue with your order, our support team is here to help resolve it.",
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes! We provide 24/7 customer support through our ticket system and live chat. Our expert team is always ready to help with any questions or issues you may have.",
    },
    {
      question: "What is the minimum order quantity?",
      answer: "Minimum order quantities vary by service, typically ranging from 50 to 1000. You can find the minimum and maximum order limits in each service description on our services page.",
    },
    {
      question: "Can I become a reseller?",
      answer: "Yes! We offer API access for resellers. You can integrate our services into your own panel and resell them to your customers. Contact our support team to learn more about reseller packages and API documentation.",
    },
    {
      question: "What if my order doesn't complete?",
      answer: "If your order doesn't complete as expected, please contact our support team immediately. We'll investigate the issue and either complete the order or provide a full refund. Customer satisfaction is our priority.",
    },
    {
      question: "Are there any hidden fees?",
      answer: "No! We believe in transparent pricing. The price you see is the price you pay. There are no hidden fees, setup costs, or monthly subscriptions. You only pay for the services you order.",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-surface to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-lg text-on-surface-variant">
            Find answers to common questions about our services
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-card"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface-container transition-colors"
                >
                  <span className="font-semibold text-on-surface pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-on-surface-variant flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-on-surface-variant leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-surface-container-lowest rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-on-surface mb-3">Still have questions?</h2>
            <p className="text-on-surface-variant mb-6">
              Our support team is available 24/7 to help you with any questions.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all shadow-card"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
