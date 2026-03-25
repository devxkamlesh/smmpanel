import Link from "next/link";
import { Zap, Share2, MessageCircle, Globe2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest py-12 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-on-surface">
                SMM<span className="text-primary">Panel</span>
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">
              The world's most trusted SMM panel for social media growth.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/#features" className="hover:text-on-surface transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-on-surface transition-colors">Pricing</Link></li>
              <li><Link href="/services-public" className="hover:text-on-surface transition-colors">Services</Link></li>
              <li><Link href="/api-docs" className="hover:text-on-surface transition-colors">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/about" className="hover:text-on-surface transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-on-surface transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-on-surface transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-on-surface transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/help" className="hover:text-on-surface transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-on-surface transition-colors">FAQ</Link></li>
              <li><Link href="/status" className="hover:text-on-surface transition-colors">Status</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-outline">
            © {new Date().getFullYear()} SMM Panel. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-outline hover:text-on-surface transition-colors">
              <Share2 className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-outline hover:text-on-surface transition-colors">
              <MessageCircle className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-outline hover:text-on-surface transition-colors">
              <Globe2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
