"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Image from "next/image";
import { dbMock, MockProduct } from "@/lib/dbMock";

export default function AdminEditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<MockProduct | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.url);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error uploading file: " + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    // Load categories
    const cats = dbMock.getCategories();
    setCategories(cats);

    // Load product details
    const p = dbMock.getProductById(params.id);
    if (p) {
      setProduct(p);
      setName(p.name);
      setDescription(p.description);
      setSlug(p.slug || "");
      setPrice(String(p.price));
      setCompareAtPrice(p.compareAtPrice ? String(p.compareAtPrice) : "");
      setCategory(p.category);
      setStock(String(p.stock));
      setImage(p.image);
      setSize(p.size || "");
      setColor(p.color || "");
      setIsActive(p.isActive !== false); // default to true
    }
    setLoading(false);
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!name || !description || !price || !stock || !image || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    dbMock.updateProduct({
      ...product,
      name,
      description,
      slug,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : parseFloat(price),
      category,
      stock: parseInt(stock),
      image,
      size,
      color,
      isActive
    });

    alert("Product details updated successfully!");
    router.push("/admin/products");
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto">
          <AlertCircle size={20} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Product Not Found</h3>
        <p className="text-slate-500 text-xs">The product with ID {params.id} could not be resolved.</p>
        <button
          onClick={() => router.push("/admin/products")}
          className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      
      {/* Back button and title */}
      <div className="space-y-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Products
        </button>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Edit Product</h2>
        <p className="text-slate-500 text-xs sm:text-sm">Modify inventory details for ID: <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded-md">{product.id}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-6 shadow-xs">
        
        {/* Core details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Product Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Title *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-medium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Slug / Link URL</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Pricing and Stock */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Pricing & Logistics</h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-bold"
                required
              />
            </div>
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compare At (₹)</label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
            </div>
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Level *</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-semibold"
                required
              />
            </div>
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-bold bg-white"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Media and Variants */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Media & Variants</h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Cover Image *</label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {image && (
                <div className="relative w-16 h-16 rounded-xl border overflow-hidden bg-slate-50 flex-shrink-0">
                  <Image src={image} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 w-full space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Or paste cover image URL..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-medium"
                    required
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center min-w-[100px] border border-slate-200">
                    {isUploading ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Size Variant</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Color Variant</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Catalog Status Toggle */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Catalog Control</h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activeToggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded-lg outline-none focus:ring-emerald-500"
            />
            <label htmlFor="activeToggle" className="text-xs font-semibold text-slate-700 select-none">
              Publish Product (Enable product to be visible and purchasable in the storefront shop)
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs transition-all"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}
