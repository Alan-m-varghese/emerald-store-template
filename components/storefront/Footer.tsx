"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Send, MessageCircle } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                E
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Emerald<span className="text-primary-400">Store</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              We design and curate premium physical goods for delivery across India. Built on trust, visual excellence, and uncompromising quality.
            </p>
            {/* WhatsApp Contact Button */}
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-all duration-200"
            >
              <MessageCircle size={16} />
              <span>Chat via WhatsApp</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Shop Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/electronics" className="hover:text-primary-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/categories/apparel" className="hover:text-primary-400 transition-colors">
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link href="/categories/home-living" className="hover:text-primary-400 transition-colors">
                  Home & Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Customer Care</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/account/orders" className="hover:text-primary-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/support/shipping" className="hover:text-primary-400 transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/support/returns" className="hover:text-primary-400 transition-colors">
                  Returns & Refunds Policy
                </Link>
              </li>
              <li>
                <Link href="/support/faq" className="hover:text-primary-400 transition-colors">
                  FAQs & Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Stay Updated</h3>
            <p className="text-slate-400 text-sm">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  id="newsletter-email-input"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg pl-3 pr-10 py-2.5 text-sm outline-none text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 p-1.5 text-slate-400 hover:text-primary-400 rounded-md transition-colors"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-primary-400 font-medium transition-opacity duration-300">
                  🎉 Thank you for subscribing! Check your inbox soon.
                </p>
              )}
            </form>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-500" />
                <span>+91 99999 99999 (Mon-Sat, 9AM-6PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-500" />
                <span>support@emeraldstore.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Emerald Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/sitemap" className="hover:underline">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
