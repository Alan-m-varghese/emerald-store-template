"use client";

import React, { useState, useEffect } from "react";
import { Search, Phone, Mail, Award } from "lucide-react";
import { dbMock, MockCustomer } from "@/lib/dbMock";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<MockCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCustomers(dbMock.getCustomers());
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Customers Manager</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">View purchasing activity logs, contact credentials, and client metrics.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 transition-all text-slate-700"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4 text-center">Total Orders</th>
                  <th className="px-6 py-4 text-right">Lifetime Spend</th>
                  <th className="px-6 py-4 text-center">Customer Tier</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/20 transition-colors">
                    
                    {/* Customer Info */}
                    <td className="px-6 py-4.5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                        {cust.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{cust.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono">ID: {cust.id}</p>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-6 py-4.5 space-y-1 text-slate-600 font-medium">
                      <p className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {cust.email}</p>
                      <p className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {cust.phone}</p>
                    </td>

                    {/* Orders count */}
                    <td className="px-6 py-4.5 text-center font-bold text-slate-800">
                      {cust.ordersCount} orders
                    </td>

                    {/* Lifetime spend */}
                    <td className="px-6 py-4.5 text-right font-extrabold text-slate-950">
                      ₹{cust.totalSpent}
                    </td>

                    {/* Customer tier */}
                    <td className="px-6 py-4.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.totalSpent >= 3000
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {cust.totalSpent >= 3000 ? <Award size={10} className="fill-amber-600" /> : null}
                        {cust.totalSpent >= 3000 ? "Gold VIP" : "Standard"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4.5 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-slate-400 text-xs">
            No customers found matching search details.
          </div>
        )}
      </div>

    </div>
  );
}
