"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { dbMock, MockCoupon, MockSettings } from "@/lib/dbMock";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<MockCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [settings, setSettings] = useState<MockSettings | null>(null);

  // Load settings and check for already applied coupon
  useEffect(() => {
    setSettings(dbMock.getSettings());
    
    const saved = localStorage.getItem("emerald_applied_coupon");
    if (saved) {
      try {
        setAppliedCoupon(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl">
          🛒
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm">Add some artisan products to your cart and they will appear here.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          <span>Start Shopping</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // Calculate fees
  const shippingCharge = settings ? settings.shippingCharge : 99;
  const freeThreshold = settings ? settings.freeShippingThreshold : 1499;
  
  const shippingCost = cartTotal >= freeThreshold ? 0 : shippingCharge;
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.minOrderValue && cartTotal < appliedCoupon.minOrderValue) {
      // Coupon invalid now
      localStorage.removeItem("emerald_applied_coupon");
      setAppliedCoupon(null);
    } else {
      if (appliedCoupon.discountType === "PERCENTAGE") {
        discountAmount = Math.round(cartTotal * (appliedCoupon.discountValue / 100));
      } else {
        discountAmount = appliedCoupon.discountValue;
      }
    }
  }

  const finalTotal = cartTotal - discountAmount + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    if (!couponCode.trim()) return;

    const coupons = dbMock.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);

    if (!coupon) {
      setCouponError("Invalid coupon code or expired coupon.");
      return;
    }

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      setCouponError(`Minimum order value of ₹${coupon.minOrderValue} required.`);
      return;
    }

    setAppliedCoupon(coupon);
    localStorage.setItem("emerald_applied_coupon", JSON.stringify(coupon));
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("emerald_applied_coupon");
  };

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
        <p className="text-slate-500 text-sm">Review your selected items and apply discounts before checking out.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 space-y-6">
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                
                {/* Product Image */}
                <div className="relative w-20 h-20 bg-slate-50 border rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
                    SKU: {item.sku}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mt-0.5 hover:text-primary-600">
                    <Link href={`/products/${item.productId}`}>{item.name}</Link>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    {item.size && `Size: ${item.size}`} {item.color && ` • Color: ${item.color}`}
                  </p>
                  
                  {/* Price info for mobile */}
                  <div className="sm:hidden text-xs font-bold text-slate-900 mt-2">
                    ₹{item.price} each
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-xl px-1.5 py-0.5 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-slate-950"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-slate-950"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Total Item Price */}
                <div className="hidden sm:block text-right flex-shrink-0 font-extrabold text-sm text-slate-950 w-24">
                  ₹{item.price * item.quantity}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors flex-shrink-0"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Summary Details */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Order Summary</h2>

            <div className="space-y-3.5 text-xs text-slate-500 font-semibold border-b border-slate-50 pb-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-bold">₹{cartTotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 bg-emerald-50/50 px-2.5 py-1.5 rounded-xl items-center">
                  <span className="flex items-center gap-1">
                    <Tag size={12} /> Coupon: <b>{appliedCoupon.code}</b>
                  </span>
                  <div className="flex items-center gap-2">
                    <span>-₹{discountAmount}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 font-extrabold"
                      title="Remove promo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-slate-800 font-bold">
                  {shippingCost === 0 ? <span className="text-emerald-600 font-extrabold">FREE</span> : `₹${shippingCost}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm font-bold text-slate-800">Grand Total</span>
              <span className="text-xl font-black text-slate-950">₹{finalTotal}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Coupon Code Form */}
          {!appliedCoupon && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={14} className="text-primary-600" /> Apply Coupon
              </h3>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. EMERALD10"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700 uppercase"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-[10px] text-red-500 font-bold">{couponError}</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
