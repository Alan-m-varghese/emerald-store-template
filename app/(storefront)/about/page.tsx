"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Target, Sparkles, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col gap-20 pb-20">
      
      {/* Hero Header */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28 text-center">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
            alt="About Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-4">
          <span className="inline-flex items-center gap-1 bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles size={12} className="fill-primary-300" /> Our Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Crafting the Future of <br />
            <span className="text-primary-400">Timeless Elegance</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            We connect skilled local artisans with modern design lovers, curating physical goods that combine traditional handcrafts with absolute modern utility.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"
            alt="Artisan weaving"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">How We Started</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Handmade goods built to outlast trends.</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Emerald Store was founded in 2026 with a simple, singular belief: products should be crafted with soul, using materials that respect our environment. We began by traveling across rural manufacturing corridors, building relationships with weavers, potters, and woodcarvers.
          </p>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            By eliminating supply chain overhead and assisting artisans with contemporary product design guidelines, we bring you premium home decor and apparel that feels completely authentic yet suits the modern household.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Our Core Principles</h2>
            <p className="text-slate-500 text-xs sm:text-sm">These three pillars guide how we design, source, and manufacture everything.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                <Target size={22} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Authentic Sourcing</h3>
              <p className="text-slate-500 text-xs leading-relaxed">We trace every yarn, clay batch, and brass casting back to its origin, ensuring ethical working environments and raw material authenticity.</p>
            </div>

            {/* Value 2 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                <Heart size={22} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Artisan Sustainability</h3>
              <p className="text-slate-500 text-xs leading-relaxed">A percentage of every single transaction goes directly into the Artisan Community Pension fund, supporting elderly crafters and their families.</p>
            </div>

            {/* Value 3 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                <Award size={22} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Uncompromising Quality</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Our quality control standards inspect design alignment, stitching resilience, and packaging integrity, ensuring flawless unboxing reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Ready to see our products?</h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">Explore our premium storefront catalog and enjoy complimentary pan-India delivery today.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs py-3 px-6 rounded-full shadow-lg shadow-primary-500/25 transition-all"
        >
          <span>Explore Catalog</span>
          <ArrowRight size={16} />
        </Link>
      </section>

    </div>
  );
}
