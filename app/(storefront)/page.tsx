"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Star, Zap, Shield, RotateCcw, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Initial mock products for testing and styling the initial homepage grid
const MOCK_FEATURED_PRODUCTS = [
  {
    id: "v1",
    productId: "p1",
    name: "Classic Silk Emerald Saree",
    sku: "SAR-EME-01",
    price: 3499,
    compareAtPrice: 4999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 124,
    size: "Free Size",
    color: "Emerald Green",
    stock: 15,
  },
  {
    id: "v2",
    productId: "p2",
    name: "Minimalist Brass Table Lamp",
    sku: "LMP-BRS-02",
    price: 1899,
    compareAtPrice: 2499,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    reviewsCount: 89,
    size: "Standard",
    color: "Brass/Gold",
    stock: 8,
  },
  {
    id: "v3",
    productId: "p3",
    name: "Premium Cotton Linen Kurta",
    sku: "KRT-LIN-03",
    price: 1299,
    compareAtPrice: 1999,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
    rating: 4.5,
    reviewsCount: 65,
    size: "L",
    color: "Off-White",
    stock: 20,
  },
  {
    id: "v4",
    productId: "p4",
    name: "Handwoven Jute Floor Rug",
    sku: "RUG-JUT-04",
    price: 2199,
    compareAtPrice: 2999,
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 204,
    size: "4x6 ft",
    color: "Natural Jute",
    stock: 5,
  },
];

const MOCK_CATEGORIES = [
  { name: "Apparel & Fashion", slug: "apparel", count: "120+ Items", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400" },
  { name: "Home & Decor", slug: "home-living", count: "80+ Items", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400" },
  { name: "Eco-Friendly Tech", slug: "electronics", count: "45+ Items", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // Reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: typeof MOCK_FEATURED_PRODUCTS[0]) => {
    addToCart({
      id: product.id,
      productId: product.productId,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.image,
      size: product.size,
      color: product.color,
      stock: product.stock,
    }, 1);

    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <div className="w-full flex flex-col gap-16 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative w-full bg-slate-900 overflow-hidden py-20 lg:py-28 text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start max-w-2xl gap-6 animate-slide-up">
          <span className="inline-flex items-center gap-1 bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <Zap size={12} className="fill-primary-300" /> Premium Collection
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Crafted Goods. <br />
            <span className="text-primary-400">Timeless Quality.</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg">
            Shop custom handcrafted products made with traditional materials. Delivered nationwide with speed and customer-first care.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link
              id="hero-cta-btn"
              href="/products"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-primary-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore Catalog</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Core Value Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-24 relative z-20">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-8 gap-6 md:gap-0">
          <div className="flex items-start gap-4 p-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Free National Delivery</h3>
              <p className="text-slate-500 text-xs mt-1">Free standard shipping on all orders over ₹499 across India.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 md:pl-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Secure Payment Guarantee</h3>
              <p className="text-slate-500 text-xs mt-1">UPI, Cards, and Netbanking secured via Razorpay.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 md:pl-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
              <RotateCcw size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Easy Returns</h3>
              <p className="text-slate-500 text-xs mt-1">Hassle-free 7-day return policy for unused products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Shop by Category</h2>
            <p className="text-slate-500 text-sm mt-1">Explore carefully curated categories tailored for your home and lifestyle.</p>
          </div>
          <Link href="/categories" className="text-sm font-bold text-primary-600 hover:text-primary-500 inline-flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={`/products?category=${cat.slug}`}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white flex flex-col gap-1">
                <span className="text-xs text-primary-300 font-bold uppercase tracking-wider">{cat.count}</span>
                <h3 className="text-lg font-bold">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Flash Sale Timer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-primary-900 rounded-3xl p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute w-64 h-64 rounded-full bg-primary-800 -top-24 -left-24 opacity-30 pointer-events-none" />
          <div className="absolute w-80 h-80 rounded-full bg-primary-800 -bottom-32 -right-16 opacity-30 pointer-events-none" />

          <div className="flex flex-col gap-3 max-w-lg text-center lg:text-left relative z-10">
            <span className="inline-flex self-center lg:self-start items-center gap-1.5 bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Zap size={14} className="fill-yellow-300" /> Flash Offer
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Deal of the Day</h2>
            <p className="text-primary-100 text-sm">
              Premium physical goods catalog items at up to 40% off. Limited stock available. Claim yours before the timer runs out!
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="flex flex-col items-center">
              <span className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white border border-white/10 shadow-inner">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-primary-200 mt-2 font-bold">Hours</span>
            </div>
            <span className="text-2xl font-bold text-primary-300 -mt-6">:</span>
            <div className="flex flex-col items-center">
              <span className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white border border-white/10 shadow-inner">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-primary-200 mt-2 font-bold">Mins</span>
            </div>
            <span className="text-2xl font-bold text-primary-300 -mt-6">:</span>
            <div className="flex flex-col items-center">
              <span className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white border border-white/10 shadow-inner">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-primary-200 mt-2 font-bold">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured / Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Trending Now</h2>
            <p className="text-slate-500 text-sm mt-1">Our bestseller products and top customer picks this week.</p>
          </div>
          <Link href="/products" className="text-sm font-bold text-primary-600 hover:text-primary-500 inline-flex items-center gap-1">
            Shop All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_FEATURED_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden card-hover-glow flex flex-col"
            >
              {/* Product Image */}
              <div className="relative h-64 w-full bg-slate-50 overflow-hidden">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  -{Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)}%
                </span>
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-primary-600 transition-colors">
                    <Link href={`/products/${prod.productId}`}>{prod.name}</Link>
                  </h3>
                  
                  {/* Rating / Review Count */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-amber-400">
                      <Star size={12} className="fill-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{prod.rating}</span>
                    <span className="text-xs text-slate-400">({prod.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-2 mt-auto">
                  <span className="text-lg font-extrabold text-slate-950">₹{prod.price}</span>
                  <span className="text-xs text-slate-400 line-through">₹{prod.compareAtPrice}</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(prod)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    justAddedId === prod.id
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span>{justAddedId === prod.id ? "Added to Cart!" : "Add to Cart"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
