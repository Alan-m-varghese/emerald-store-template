"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { dbMock, MockCategory } from "@/lib/dbMock";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<MockCategory[]>([]);

  useEffect(() => {
    setCategories(dbMock.getCategories());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 flex flex-col gap-12">
      {/* Header section */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles size={12} className="fill-primary-700" /> Curated Divisions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h1>
        <p className="text-slate-500 text-sm">Explore our carefully cataloged premium items designed to enrich your lifestyle.</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end"
          >
            {/* Category Image Cover */}
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80" />

            {/* Details overlay */}
            <div className="relative z-10 p-8 text-white space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-primary-300 font-extrabold uppercase tracking-widest">
                  {cat.count}
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">{cat.name}</h3>
              </div>

              <div className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-xs px-4 py-2 rounded-xl text-xs font-semibold transition-all group-hover:translate-x-1">
                <span>View Collection</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
