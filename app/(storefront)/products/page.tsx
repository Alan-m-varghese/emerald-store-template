"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Star, ShoppingBag, RotateCcw, Check } from "lucide-react";
import { dbMock, MockProduct } from "@/lib/dbMock";
import { useCart } from "@/context/CartContext";

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Load category and search from URL query if present
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  // State
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MockProduct[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("featured");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Sync state when URL params change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Load initial data
  useEffect(() => {
    setProducts(dbMock.getProducts().filter(p => p.isActive));
    setCategories([
      { id: "all", name: "All Categories", slug: "all" },
      ...dbMock.getCategories().map(c => ({ id: c.id, name: c.name, slug: c.slug }))
    ]);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Filter by price
    result = result.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange({ min: 0, max: 10000 });
    setSortBy("featured");
    router.push("/products");
  };

  const handleAddToCart = (product: MockProduct) => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      sku: product.id, // using ID as fallback
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shop Catalog</h1>
        <p className="text-slate-500 text-sm">Browse our handcrafted premium selection and filter to your exact preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side Filters (Desktop) / Dropdowns (Mobile) */}
        <aside className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 space-y-8 sticky top-24 hidden lg:block">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal size={16} /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-primary-600 hover:text-primary-500 font-semibold flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Keyword</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-2xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
              />
              <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</label>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-primary-50 text-primary-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <Check size={12} className="text-primary-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Price (₹{priceRange.max})</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>₹0</span>
              <span>₹10,000+</span>
            </div>
          </div>
        </aside>

        {/* Mobile Filter & Search Bar */}
        <div className="lg:hidden flex flex-col sm:flex-row gap-4 bg-white p-4 border border-slate-100 rounded-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
            />
            <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-semibold outline-none focus:border-primary-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={handleResetFilters}
              className="p-2.5 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting and Count Header */}
          <div className="flex items-center justify-between bg-white px-6 py-4 border border-slate-100 rounded-2xl">
            <span className="text-xs font-semibold text-slate-500">
              Showing <b className="text-slate-900">{filteredProducts.length}</b> products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer border border-slate-200 rounded-xl px-2.5 py-1.5 hover:border-slate-300 transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Catalog Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden card-hover-glow flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative h-60 w-full bg-slate-50 overflow-hidden">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {prod.compareAtPrice > prod.price && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                        -{Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-primary-600 font-bold">
                        {categories.find(c => c.slug === prod.category)?.name || prod.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-primary-600 transition-colors">
                        <Link href={`/products/${prod.id}`}>{prod.name}</Link>
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{prod.rating}</span>
                        <span className="text-[10px] text-slate-400">({prod.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Price and Add button */}
                    <div className="flex items-baseline gap-2 mt-auto">
                      <span className="text-base font-extrabold text-slate-950">₹{prod.price}</span>
                      {prod.compareAtPrice > prod.price && (
                        <span className="text-xs text-slate-400 line-through">₹{prod.compareAtPrice}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(prod)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        justAddedId === prod.id
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <ShoppingBag size={14} />
                      <span>{justAddedId === prod.id ? "Added!" : "Add to Cart"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-900">No products found</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">We couldn&apos;t find any items matching your selected criteria. Try adjusting your filter tags or search keyword.</p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">Loading catalog...</div>}>
      <ShopCatalogContent />
    </Suspense>
  );
}
