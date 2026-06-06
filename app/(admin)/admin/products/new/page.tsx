"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Image from "next/image";
import { dbMock } from "@/lib/dbMock";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [size, setSize] = useState("Free Size");
  const [color, setColor] = useState("");
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
    const cats = dbMock.getCategories();
    setCategories(cats);
    if (cats.length > 0) setCategory(cats[0].slug);
  }, []);

  // Sync Slug automatically from Name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !stock || !image || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    dbMock.addProduct({
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
    });

    alert("Product added successfully!");
    router.push("/admin/products");
  };

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
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Add New Product</h2>
        <p className="text-slate-500 text-xs sm:text-sm">Create a new item in your physical goods inventory.</p>
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
                placeholder="e.g. Classic Silk Emerald Saree"
                value={name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-medium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Slug / Link URL</label>
              <input
                type="text"
                placeholder="e.g. classic-silk-emerald-saree"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description *</label>
            <textarea
              rows={4}
              placeholder="Provide a detailed overview of materials, weave style, dimensions, care guides..."
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
                placeholder="3499"
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
                placeholder="4999"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
            </div>
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Level *</label>
              <input
                type="number"
                placeholder="15"
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
                placeholder="e.g. Free Size, Standard, L, XL"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Color Variant</label>
              <input
                type="text"
                placeholder="e.g. Emerald Green, Brass/Gold"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
            </div>
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
            <Save size={14} /> Add Product
          </button>
        </div>

      </form>
    </div>
  );
}
