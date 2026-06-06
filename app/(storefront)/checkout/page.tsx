"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, ShieldCheck, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { dbMock, MockCoupon, MockSettings } from "@/lib/dbMock";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();

  // Settings & Coupons
  const [settings, setSettings] = useState<MockSettings | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<MockCoupon | null>(null);

  // Form State
  const [shippingForm, setShippingForm] = useState({
    name: "",
    email: "",
    phone: "9876543210",
    street: "Flat 405, Block C, Maple Heights",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001"
  });

  // Redirect if not logged in
  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [isInitialized, user, router]);

  // Sync profile details when user loads
  useEffect(() => {
    if (user) {
      setShippingForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [cardForm, setCardForm] = useState({ number: "4321 8899 0011 2233", expiry: "12/29", cvv: "123" });
  const [upiForm, setUpiForm] = useState({ vpa: "rajesh@okaxis" });

  // Processing & Success State
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setSettings(dbMock.getSettings());
    
    // Read applied coupon
    const saved = localStorage.getItem("emerald_applied_coupon");
    if (saved) {
      try {
        setAppliedCoupon(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (cart.length === 0 && !placedOrderId) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-4xl">🛒</div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/products" className="inline-flex bg-slate-900 text-white text-xs font-semibold py-2.5 px-6 rounded-xl">
          View Catalog
        </Link>
      </div>
    );
  }

  // Cost calculations
  const shippingCharge = settings ? settings.shippingCharge : 99;
  const freeThreshold = settings ? settings.freeShippingThreshold : 1499;
  const shippingCost = cartTotal >= freeThreshold ? 0 : shippingCharge;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round(cartTotal * (appliedCoupon.discountValue / 100));
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = cartTotal - discountAmount + shippingCost;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as unknown as { Razorpay: unknown }).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to initialize payment.");
      }

      const orderItems = cart.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
        sku: item.sku
      }));

      const placeDbOrder = async () => {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: shippingForm.name,
            customerEmail: shippingForm.email,
            total: finalTotal,
            items: orderItems,
            shippingAddress: {
              street: shippingForm.street,
              city: shippingForm.city,
              state: shippingForm.state,
              postalCode: shippingForm.postalCode,
              phone: shippingForm.phone
            },
            couponCode: appliedCoupon?.code
          })
        });
        const orderData = await orderRes.json();
        if (orderData.success) {
          clearCart();
          localStorage.removeItem("emerald_applied_coupon");
          setPlacedOrderId(orderData.order.id);
        } else {
          alert("Error saving your order: " + (orderData.error || "Unknown error"));
        }
        setIsProcessing(false);
      };

      if (data.simulated) {
        setTimeout(() => {
          placeDbOrder();
        }, 1500);
      } else {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Failed to load Razorpay SDK. Please check your network connection.");
          setIsProcessing(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: data.amount,
          currency: "INR",
          name: "Emerald Store",
          description: "Premium Artisan Handcrafted Goods",
          order_id: data.orderId,
          handler: function () {
            placeDbOrder();
          },
          prefill: {
            name: shippingForm.name,
            email: shippingForm.email,
            contact: shippingForm.phone
          },
          theme: {
            color: "#059669"
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as unknown as { Razorpay: new (opt: unknown) => { open: () => void } }).Razorpay(options);
        rzp.open();
      }

    } catch (err) {
      alert("Checkout error: " + (err as Error).message);
      setIsProcessing(false);
    }
  };

  // SUCCESS SCREEN
  if (placedOrderId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 md:py-24 text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full">
          <CheckCircle size={48} className="stroke-[1.5]" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-slate-500 text-sm">
            Thank you for shopping with us. Your transaction has been secured.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-semibold">ORDER ID</span>
            <span className="font-bold text-slate-800">{placedOrderId}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-semibold">DELIVERY METHOD</span>
            <span className="font-semibold text-slate-700">Standard Express Courier</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-semibold">ESTIMATED ARRIVAL</span>
            <span className="font-bold text-emerald-600">3 - 5 Business Days</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-slate-400 font-semibold">DELIVERY ADDRESS</span>
            <span className="font-semibold text-slate-700 max-w-[250px] text-right truncate">
              {shippingForm.street}, {shippingForm.city}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-xs"
          >
            Track in My Account
          </Link>
          <Link
            href="/products"
            className="border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-slate-500 text-sm">Secure your order by filling in shipping address and payment.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Shipping Form & Payment details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Form */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Shipping Address</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={shippingForm.name}
                  onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
                <input
                  type="tel"
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flat details / Street</label>
                <input
                  type="text"
                  value={shippingForm.street}
                  onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State</label>
                <input
                  type="text"
                  value={shippingForm.state}
                  onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ZIP Pincode</label>
                <input
                  type="text"
                  value={shippingForm.postalCode}
                  onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Payment Details</h2>

            {/* Select Method */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 p-4 rounded-2xl border flex items-center gap-3 transition-colors ${
                  paymentMethod === "card"
                    ? "border-primary-600 bg-primary-50/50 text-slate-900"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <CreditCard size={18} />
                <span className="text-xs font-bold">Credit/Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`flex-1 p-4 rounded-2xl border flex items-center gap-3 transition-colors ${
                  paymentMethod === "upi"
                    ? "border-primary-600 bg-primary-50/50 text-slate-900"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <span className="text-[10px] font-black tracking-widest border border-slate-300 px-1 py-0.5 rounded-sm">UPI</span>
                <span className="text-xs font-bold">UPI / GPay / PhonePe</span>
              </button>
            </div>

            {/* Card inputs */}
            {paymentMethod === "card" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Card Number</label>
                  <input
                    type="text"
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 text-slate-700"
                    placeholder="XXXX XXXX XXXX XXXX"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</label>
                    <input
                      type="text"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 text-slate-700"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CVV Code</label>
                    <input
                      type="password"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 text-slate-700"
                      placeholder="•••"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiForm.vpa}
                  onChange={(e) => setUpiForm({ ...upiForm, vpa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 text-slate-700"
                  placeholder="e.g. name@upi"
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* Right side checkout items summary */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Order Items</h2>
            
            {/* Items list */}
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-slate-50 border rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 flex-shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-500 font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-bold">₹{cartTotal}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-slate-800 font-bold">
                  {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-50 pt-3 items-baseline">
                <span className="text-sm font-bold text-slate-800">Total Payable</span>
                <span className="text-lg font-black text-slate-950">₹{finalTotal}</span>
              </div>
            </div>

            {/* Payment security info */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold bg-slate-50 p-3 rounded-2xl justify-center">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Payments Secured via Razorpay PCI-DSS</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing Security Payment..." : `Place Order • ₹${finalTotal}`}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
