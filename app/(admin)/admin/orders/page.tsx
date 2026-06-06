"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, Eye, X, Truck } from "lucide-react";
import { dbMock, MockOrder } from "@/lib/dbMock";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);

  // Manual Logistics Courier Tracking Form States
  const [carrier, setCarrier] = useState("Delhivery");
  const [customCarrier, setCustomCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    setOrders(dbMock.getOrders());
  }, []);

  // Sync tracking input states when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      if (selectedOrder.trackingNumber) {
        setTrackingNumber(selectedOrder.trackingNumber);
        const savedCourier = selectedOrder.courier || "";
        const presets = ["Delhivery", "DTDC", "Blue Dart", "Professional Couriers", "Speed Post"];
        if (presets.includes(savedCourier)) {
          setCarrier(savedCourier);
          setCustomCarrier("");
        } else if (savedCourier) {
          setCarrier("Other");
          setCustomCarrier(savedCourier);
        } else {
          setCarrier("Delhivery");
          setCustomCarrier("");
        }
      } else {
        setCarrier("Delhivery");
        setCustomCarrier("");
        setTrackingNumber("");
      }
    }
  }, [selectedOrder]);

  const handleUpdateStatus = (orderId: string, status: MockOrder["status"]) => {
    const allOrders = dbMock.getOrders();
    const index = allOrders.findIndex(o => o.id === orderId);
    if (index > -1) {
      allOrders[index].status = status;
      dbMock.saveOrders(allOrders);
      setOrders(allOrders);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(allOrders[index]);
      }
    }
  };

  const handleUpdatePaymentStatus = (orderId: string, paymentStatus: MockOrder["paymentStatus"]) => {
    const allOrders = dbMock.getOrders();
    const index = allOrders.findIndex(o => o.id === orderId);
    if (index > -1) {
      allOrders[index].paymentStatus = paymentStatus;
      dbMock.saveOrders(allOrders);
      setOrders(allOrders);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(allOrders[index]);
      }
    }
  };

  const handleSaveTracking = (orderId: string) => {
    if (!trackingNumber.trim()) {
      alert("Please enter a tracking ID.");
      return;
    }
    const finalCourier = carrier === "Other" ? customCarrier.trim() : carrier;
    if (carrier === "Other" && !finalCourier) {
      alert("Please enter the custom carrier name.");
      return;
    }

    const allOrders = dbMock.getOrders();
    const index = allOrders.findIndex(o => o.id === orderId);
    if (index > -1) {
      allOrders[index].trackingNumber = trackingNumber.trim();
      allOrders[index].courier = finalCourier;
      allOrders[index].status = "SHIPPED"; // automatically marked as Shipped upon manual logging
      dbMock.saveOrders(allOrders);
      setOrders(allOrders);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(allOrders[index]);
      }
      alert(`Manual tracking details updated. Order is marked as SHIPPED!`);
    }
  };

  // Filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer Name", "Customer Email", "Date", "Total Payable", "Fulfillment Status", "Payment Status", "Tracking ID"];
    const rows = filteredOrders.map(o => [
      o.id,
      o.customerName,
      o.customerEmail,
      o.date,
      String(o.total),
      o.status,
      o.paymentStatus,
      o.trackingNumber || ""
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Orders Manager</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Monitor payments, track shipment fulfillment logs, and book logistics pick-ups.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search orders by ID, name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 transition-all text-slate-700"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline flex-shrink-0">
            <SlidersHorizontal size={12} className="inline mr-1" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4 text-right">Total Payable</th>
                  <th className="px-6 py-4 text-center">Fulfillment Status</th>
                  <th className="px-6 py-4 text-center">Payment Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-4.5 font-bold text-slate-900 font-mono">
                      {order.id}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4.5">
                      <p className="font-bold text-slate-800">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{order.customerEmail}</p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4.5 text-center text-slate-500 font-semibold">
                      {order.date}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4.5 text-right font-extrabold text-slate-950">
                      ₹{order.total}
                    </td>

                    {/* Fulfillment Status */}
                    <td className="px-6 py-4.5 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "CANCELLED"
                            ? "bg-red-50 text-red-700"
                            : order.status === "PENDING"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4.5 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.paymentStatus === "UNPAID"
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 rounded-xl hover:bg-emerald-50/20 font-bold transition-all"
                      >
                        <Eye size={12} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-slate-400 text-xs">
            No matching orders found.
          </div>
        )}
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col gap-6 animate-slide-right">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Invoice Order</span>
                <h3 className="text-base font-black text-slate-900 font-mono mt-0.5">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Shipping address */}
            <div className="space-y-3.5 border-b border-slate-100 pb-5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logistics & Endpoint</h4>
              <div className="text-xs space-y-1.5 text-slate-600 font-semibold">
                <p>Customer: <b className="text-slate-800">{selectedOrder.customerName}</b> ({selectedOrder.customerEmail})</p>
                <p>Phone No: {selectedOrder.shippingAddress.phone}</p>
                <p>Address: {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}</p>
              </div>
            </div>

            {/* Items details */}
            <div className="space-y-3.5 border-b border-slate-100 pb-5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Line Items</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div className="relative w-8 h-8 rounded-lg bg-slate-50 border overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{item.quantity} units {item.size && `• Size: ${item.size}`}</p>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost and total */}
            <div className="flex justify-between items-baseline border-b border-slate-100 pb-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Paid amount</span>
              <span className="text-base font-black text-slate-950">₹{selectedOrder.total}</span>
            </div>

            {/* Action Controllers */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fulfillment controls</h4>
              
              {/* Dropdown status update */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Fulfillment</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as MockOrder["status"])}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-bold outline-none focus:border-emerald-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PACKED">Packed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Payment Status</label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value as MockOrder["paymentStatus"])}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-bold outline-none focus:border-emerald-500"
                  >
                    <option value="UNPAID">Unpaid</option>
                    <option value="PAID">Paid</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Logistics tracking actions */}
              <div className="bg-slate-50 border rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Truck size={14} className="text-slate-400" /> Courier Logistics Entry
                  </span>
                  {selectedOrder.trackingNumber ? (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Shipped
                    </span>
                  ) : (
                    <span className="text-slate-400 font-semibold">Not scheduled</span>
                  )}
                </div>

                {/* Courier Preset Selection */}
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Carrier Partner</label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold outline-none focus:border-emerald-500"
                    >
                      <option value="Delhivery">Delhivery</option>
                      <option value="DTDC">DTDC</option>
                      <option value="Blue Dart">Blue Dart</option>
                      <option value="Professional Couriers">Professional Couriers</option>
                      <option value="Speed Post">Speed Post</option>
                      <option value="Other">Other (Custom)</option>
                    </select>
                  </div>

                  {/* Free-text Custom Courier Input */}
                  {carrier === "Other" && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Carrier Name</label>
                      <input
                        type="text"
                        placeholder="Enter carrier name..."
                        value={customCarrier}
                        onChange={(e) => setCustomCarrier(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  {/* Tracking Number Input */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tracking ID / Number</label>
                    <input
                      type="text"
                      placeholder="e.g. DELH123456789"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Save button */}
                  <button
                    type="button"
                    onClick={() => handleSaveTracking(selectedOrder.id)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-xs"
                  >
                    {selectedOrder.trackingNumber ? "Update Tracking Details" : "Save Details & Mark Shipped"}
                  </button>

                  {/* Current Active Tracking Info Display */}
                  {selectedOrder.trackingNumber && (
                    <div className="bg-white/80 border border-slate-100 rounded-xl p-2.5 text-[10px] text-slate-500 font-semibold space-y-0.5 mt-2">
                      <p>Carrier: <b className="text-slate-800">{selectedOrder.courier || "Delivery Express"}</b></p>
                      <p>Tracking Code: <b className="text-slate-800 font-mono">{selectedOrder.trackingNumber}</b></p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
