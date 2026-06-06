"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, MapPin, Receipt, Trash2, Edit2, Plus, Check } from "lucide-react";
import { dbMock, MockOrder } from "@/lib/dbMock";
import { useAuth } from "@/context/AuthContext";

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr1",
    type: "Home (Shipping)",
    street: "Flat 405, Block C, Maple Heights",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    phone: "9876543210",
    isDefault: true
  }
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  
  // Account State
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("orders");
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "9876543210"
  });

  // Redirect if not logged in
  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login?redirect=/account");
    }
  }, [isInitialized, user, router]);

  // Sync profile details when user loads
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: ""
  });

  const [orders, setOrders] = useState<MockOrder[]>([]);

  useEffect(() => {
    // Load orders matching user email
    const allOrders = dbMock.getOrders();
    const userOrders = allOrders.filter(o => o.customerEmail.toLowerCase() === profile.email.toLowerCase());
    setOrders(userOrders);
  }, [profile.email]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile details updated successfully!");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      // Edit
      setAddresses(prev => prev.map(addr => addr.id === editingAddressId ? { ...addr, ...newAddress } : addr));
      setEditingAddressId(null);
    } else {
      // Add
      const addr: Address = {
        id: "addr_" + Date.now(),
        ...newAddress,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, addr]);
    }
    setNewAddress({ type: "Home", street: "", city: "", state: "", postalCode: "", phone: "" });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setNewAddress({
      type: addr.type,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      phone: addr.phone
    });
    setShowAddressForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8 items-start">
      
      {/* Navigation tabs left sidebar */}
      <aside className="w-full md:w-64 bg-white border border-slate-100 rounded-3xl p-6 flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
          <span className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 font-extrabold flex items-center justify-center">
            RK
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{profile.name}</h2>
            <p className="text-[10px] text-slate-400 font-semibold">{profile.email}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
            activeTab === "orders"
              ? "bg-primary-50 text-primary-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          }`}
        >
          <Receipt size={16} />
          <span>Order History</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
            activeTab === "addresses"
              ? "bg-primary-50 text-primary-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          }`}
        >
          <MapPin size={16} />
          <span>Address Book</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
            activeTab === "profile"
              ? "bg-primary-50 text-primary-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          }`}
        >
          <User size={16} />
          <span>Profile Details</span>
        </button>
      </aside>

      {/* Main panel content */}
      <main className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 min-h-[400px] w-full">
        
        {/* TAB 1: ORDER HISTORY */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Order History</h2>
              <p className="text-slate-500 text-xs mt-0.5">Track your pending shipments and view past invoice orders.</p>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:border-slate-200 transition-colors"
                  >
                    {/* Header bar */}
                    <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 text-xs">
                      <div className="flex gap-6">
                        <div>
                          <p className="text-slate-400 font-semibold">ORDER ID</p>
                          <p className="font-extrabold text-slate-800 mt-0.5">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold">DATE PLACED</p>
                          <p className="font-bold text-slate-700 mt-0.5">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold">TOTAL AMOUNT</p>
                          <p className="font-extrabold text-slate-900 mt-0.5">₹{order.total}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.status === "CANCELLED"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Products details */}
                    <div className="p-5 divide-y divide-slate-50">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                          <div className="relative w-12 h-12 bg-slate-50 border rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                              Quantity: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 font-extrabold text-xs text-slate-900">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer tracking detail & Print Invoice */}
                    <div className="border-t border-slate-50 px-5 py-3 text-[11px] text-slate-500 font-semibold bg-slate-50/30 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        {order.trackingNumber ? (
                          <span>
                            Shipped via <b className="text-slate-800 font-bold">{order.courier || "Delivery Express"}</b> • Tracking ID: <b className="text-slate-800 font-bold">{order.trackingNumber}</b>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">Order Status: {order.status}</span>
                        )}
                      </div>
                      <a
                        href={`/orders/${order.id}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold transition-all shadow-xs"
                      >
                        <Receipt size={10} /> Print Invoice
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12 text-xs border border-dashed rounded-2xl">
                No orders placed yet. Start shopping to create invoices!
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Address Book</h2>
                <p className="text-slate-500 text-xs mt-0.5">Manage shipping and billing delivery endpoints.</p>
              </div>
              {!showAddressForm && (
                <button
                  onClick={() => {
                    setEditingAddressId(null);
                    setNewAddress({ type: "Home", street: "", city: "", state: "", postalCode: "", phone: "" });
                    setShowAddressForm(true);
                  }}
                  className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  <Plus size={14} /> Add Address
                </button>
              )}
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {editingAddressId ? "Modify Shipping Address" : "Create Shipping Address"}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Home, Office, Staging"
                      value={newAddress.type}
                      onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Street details & Apartment</label>
                  <input
                    type="text"
                    placeholder="Suite, House No, Sector details"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      placeholder="City name"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      placeholder="State name"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pincode</label>
                    <input
                      type="text"
                      placeholder="6-digit ZIP"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-700"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                  >
                    {editingAddressId ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </form>
            )}

            {/* List addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-slate-100 rounded-2xl p-5 space-y-4 hover:border-slate-200 transition-colors"
                >
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-slate-800">{addr.type}</span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                        <Check size={10} /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {addr.street} <br />
                    {addr.city}, {addr.state} - {addr.postalCode} <br />
                    Phone: {addr.phone}
                  </p>
                  <div className="flex gap-3 justify-end text-[11px] font-bold border-t border-slate-50 pt-3 text-slate-400">
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="hover:text-primary-600 flex items-center gap-1"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="hover:text-red-500 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE DETAILS */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Profile Details</h2>
              <p className="text-slate-500 text-xs mt-0.5">Edit credentials and login options.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all"
              >
                Save Details
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
