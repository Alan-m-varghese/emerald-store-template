"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { dbMock, MockOrder } from "@/lib/dbMock";
import { Printer, ArrowLeft } from "lucide-react";

export default function InvoicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allOrders = dbMock.getOrders();
    const foundOrder = allOrders.find((o) => o.id === params.id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading invoice data...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Invoice Not Found</h3>
        <p className="text-slate-500 text-xs">The order with ID {params.id} could not be resolved.</p>
        <button
          onClick={() => router.back()}
          className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = order.total >= 1499 ? 0 : 99;
  const gst = Math.round(subtotal * 0.18);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center items-start print:bg-white print:p-0">
      <div className="max-w-3xl w-full bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-sm space-y-8 print:border-0 print:shadow-none print:rounded-none">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 print:hidden">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs transition-all"
          >
            <Printer size={14} /> Print Invoice
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-black text-emerald-600 tracking-tight">Emerald Store</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Premium Physical Handcrafted Goods</p>
            <div className="text-[11px] text-slate-500 font-semibold space-y-0.5 mt-2">
              <p>Email: support@emeraldstore.in</p>
              <p>Phone: +91 99999 88888</p>
              <p>GSTIN: 27AAAAA1111A1Z1 (Sample)</p>
            </div>
          </div>
          <div className="sm:text-right space-y-1">
            <h2 className="text-xl font-bold text-slate-900 font-mono uppercase">Invoice</h2>
            <p className="text-xs text-slate-500 font-semibold">Order ID: <b className="text-slate-800 font-mono font-bold">{order.id}</b></p>
            <p className="text-xs text-slate-500 font-semibold">Date Placed: {order.date}</p>
            <p className="text-xs text-slate-500 font-semibold">Payment Method: Online Secured</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-6 text-xs text-slate-600 font-semibold">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ship To:</h4>
            <p className="text-slate-900 font-bold text-sm">{order.customerName}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
            <p>Address: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
          </div>
          <div className="space-y-2 sm:text-right">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Details:</h4>
            <p className="text-slate-900 font-bold">{order.customerName}</p>
            <p>Email: {order.customerEmail}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Line Items</h4>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 text-left">Description</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-center">Quantity</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 text-slate-900 font-bold">
                    {item.name}
                    {item.size && <span className="text-[10px] text-slate-400 font-medium block">Size: {item.size} {item.color && `• Color: ${item.color}`}</span>}
                  </td>
                  <td className="py-3.5 text-right font-semibold text-slate-700">₹{item.price}</td>
                  <td className="py-3.5 text-center font-bold text-slate-800">{item.quantity}</td>
                  <td className="py-3.5 text-right font-extrabold text-slate-900">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end border-t border-slate-100 pt-6 space-y-2 text-xs">
          <div className="w-full sm:w-64 space-y-2.5 text-slate-500 font-semibold">
            <div className="flex justify-between">
              <span>Subtotal (Before Tax)</span>
              <span className="text-slate-800 font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18% GST Included)</span>
              <span className="text-slate-700 font-bold">₹{gst}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-slate-800 font-bold">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-black text-slate-900">
              <span>Grand Total</span>
              <span className="text-base text-slate-950 font-black">₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 font-semibold pt-12 border-t border-slate-100/50 space-y-1">
          <p>Thank you for supporting master craftsmanship!</p>
          <p>This is a computer-generated tax invoice and does not require a physical signature.</p>
        </div>

      </div>
    </div>
  );
}
