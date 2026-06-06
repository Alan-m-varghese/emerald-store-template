"use client";

import React, { useState, useEffect } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";
import { dbMock, MockCoupon } from "@/lib/dbMock";

export default function AdminPromotionsPage() {
  const [coupons, setCoupons] = useState<MockCoupon[]>([]);

  // Create Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setCoupons(dbMock.getCoupons());
  }, []);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !discountValue) {
      alert("Please fill in required fields.");
      return;
    }

    dbMock.addCoupon({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
    });

    setCoupons(dbMock.getCoupons());
    
    // Reset form
    setCode("");
    setDiscountValue("");
    setMinOrderValue("");
    setShowAddForm(false);
    
    alert(`Coupon code ${code.toUpperCase()} created successfully!`);
  };

  const handleToggleActive = (coupon: MockCoupon) => {
    const updated = { ...coupon, isActive: !coupon.isActive };
    dbMock.updateCoupon(updated);
    setCoupons(dbMock.getCoupons());
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon code?")) {
      const allCoupons = dbMock.getCoupons();
      const filtered = allCoupons.filter(c => c.id !== id);
      dbMock.saveCoupons(filtered);
      setCoupons(filtered);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Promotions & Coupons</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Create marketing discount campaigns and manage promo checkout codes.</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={14} /> Add Coupon Code
          </button>
        )}
      </div>

      {/* Add Coupon Form */}
      {showAddForm && (
        <form onSubmit={handleCreateCoupon} className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-xs max-w-2xl animate-slide-up">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Tag size={14} className="text-emerald-600" /> Create Discount Campaign
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coupon Code *</label>
              <input
                type="text"
                placeholder="e.g. MEGA50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-750 font-bold uppercase"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-bold bg-white"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat Discount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount Value *</label>
              <input
                type="number"
                placeholder={discountType === "PERCENTAGE" ? "e.g. 10 (for 10%)" : "e.g. 300 (for ₹300 off)"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minimum Order Total (₹)</label>
              <input
                type="number"
                placeholder="e.g. 999 (0 if no minimum)"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Create Campaign
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table List */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
        {coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Promo Code</th>
                  <th className="px-6 py-4">Discount Structure</th>
                  <th className="px-6 py-4 text-right">Min Order Threshold</th>
                  <th className="px-6 py-4 text-center">Campaign Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/20 transition-colors">
                    
                    {/* Code */}
                    <td className="px-6 py-4.5 font-bold text-slate-900 font-mono tracking-wider text-[13px]">
                      {coupon.code}
                    </td>

                    {/* Discount value details */}
                    <td className="px-6 py-4.5 font-semibold text-slate-700">
                      {coupon.discountType === "PERCENTAGE" ? (
                        <span>{coupon.discountValue}% Off total order</span>
                      ) : (
                        <span>Flat ₹{coupon.discountValue} Off invoice</span>
                      )}
                    </td>

                    {/* Min order value */}
                    <td className="px-6 py-4.5 text-right font-extrabold text-slate-900">
                      ₹{coupon.minOrderValue}
                    </td>

                    {/* Campaign status active toggle */}
                    <td className="px-6 py-4.5 text-center min-w-[120px]">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                          coupon.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {coupon.isActive ? "ACTIVE" : "PAUSED"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 text-center">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="hover:text-red-500 text-slate-400 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
                        title="Delete coupon"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-slate-400 text-xs">
            No active discount coupon codes.
          </div>
        )}
      </div>

    </div>
  );
}
