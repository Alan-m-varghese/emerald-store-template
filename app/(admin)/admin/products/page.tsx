"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, AlertCircle } from "lucide-react";
import { dbMock, MockProduct } from "@/lib/dbMock";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    // Load products and categories from state
    setProducts(dbMock.getProducts());
    setCategories([
      { id: "all", name: "All Categories", slug: "all" },
      ...dbMock.getCategories().map(c => ({ id: c.id, name: c.name, slug: c.slug }))
    ]);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      dbMock.deleteProduct(id);
      setProducts(dbMock.getProducts());
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ["Product ID", "Name", "Slug", "Category", "Price", "Compare At Price", "Stock", "Status"];
    const rows = filteredProducts.map(p => [
      p.id,
      p.name,
      p.slug || "",
      p.category,
      String(p.price),
      String(p.compareAtPrice || p.price),
      String(p.stock),
      p.isActive ? "ACTIVE" : "INACTIVE"
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `products_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Products Manager</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage your storefront physical inventory and catalog details.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all"
          >
            Export CSV
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={14} /> Add New Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search products by name, ID or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 transition-all text-slate-700"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline flex-shrink-0">
            <SlidersHorizontal size={12} className="inline mr-1" /> Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold outline-none focus:border-emerald-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Product details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Stock Level</th>
                  <th className="px-6 py-4 text-center">Catalog Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* Details */}
                    <td className="px-6 py-4.5 flex items-center gap-4.5 min-w-[280px]">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-50 border overflow-hidden flex-shrink-0">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-900 line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">ID: {prod.id}</p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4.5 text-slate-600 font-semibold capitalize">
                      {categories.find(c => c.slug === prod.category)?.name.replace(" & Fashion", "").replace(" & Decor", "") || prod.category}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4.5 text-right font-extrabold text-slate-900 min-w-[100px]">
                      ₹{prod.price}
                    </td>

                    {/* Stock level */}
                    <td className="px-6 py-4.5 text-center min-w-[120px]">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.stock === 0
                            ? "bg-red-50 text-red-700"
                            : prod.stock <= 5
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>

                    {/* Catalog status */}
                    <td className="px-6 py-4.5 text-center min-w-[120px]">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prod.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 text-center min-w-[120px]">
                      <div className="flex items-center justify-center gap-3 font-semibold text-slate-400">
                        <Link
                          href={`/admin/products/${prod.id}/edit`}
                          className="hover:text-emerald-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="hover:text-red-500 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-base">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No products found</h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">There are no items matching your criteria in the inventory log.</p>
          </div>
        )}
      </div>

    </div>
  );
}
