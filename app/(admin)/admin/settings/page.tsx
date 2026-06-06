"use client";

import React, { useState, useEffect } from "react";
import { Save, ShieldAlert } from "lucide-react";
import { dbMock, MockSettings } from "@/lib/dbMock";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<MockSettings | null>(null);
  
  // Local Form state
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [shippingCharge, setShippingCharge] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const s = dbMock.getSettings();
    if (s) {
      setSettings(s);
      setStoreName(s.storeName);
      setStoreEmail(s.storeEmail);
      setStorePhone(s.storePhone);
      setCurrency(s.currency || "INR");
      setShippingCharge(String(s.shippingCharge));
      setFreeShippingThreshold(String(s.freeShippingThreshold));
      setTaxRate(String(s.taxRate));
      setMaintenanceMode(s.maintenanceMode || false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dbMock.saveSettings({
      storeName,
      storeEmail,
      storePhone,
      currency,
      shippingCharge: parseFloat(shippingCharge),
      freeShippingThreshold: parseFloat(freeShippingThreshold),
      taxRate: parseFloat(taxRate),
      maintenanceMode
    });

    alert("Store configurations updated successfully!");
  };

  if (!settings) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading store configurations...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Store Settings</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Configure global pricing thresholds, support contacts, tax margins, and operational modes.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-6 shadow-xs">
        
        {/* Identity & Support */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Store Identity</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Store Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-semibold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support Email Address</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support Contact Number</label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing & Checkout Calculations */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">logistics & Taxes</h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-bold bg-white"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipping Fee (₹)</label>
              <input
                type="number"
                value={shippingCharge}
                onChange={(e) => setShippingCharge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-bold"
                required
              />
            </div>
            <div className="space-y-1 text-slate-700">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Shipping Threshold</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-700 font-bold"
                required
              />
            </div>
          </div>
        </div>

        {/* Maintenance Controls */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">System Mode</h3>
          
          <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="maintenanceToggle"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded-lg outline-none focus:ring-emerald-500"
              />
              <label htmlFor="maintenanceToggle" className="text-xs font-extrabold text-slate-900 select-none">
                Enable Maintenance Mode
              </label>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal flex items-start gap-1 font-semibold">
              <ShieldAlert size={14} className="text-amber-500 flex-shrink-0" />
              <span>When checked, all storefront customer pages redirect to a locked maintenance layout page, blocking catalog purchases and updates. Use this during database schema changes or pricing audits.</span>
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all"
          >
            <Save size={14} /> Save Configurations
          </button>
        </div>

      </form>
    </div>
  );
}
