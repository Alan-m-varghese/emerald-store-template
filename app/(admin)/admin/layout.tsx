"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Menu,
  X,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isInitialized, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: Receipt },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 font-semibold text-xs">
        Verifying secure admin session...
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl flex flex-col items-center">
          <div className="inline-flex p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl mx-auto">
            <ShieldAlert size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">Access Denied</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              You do not have administrative privileges to view this dashboard. Please sign in with an administrator account to continue.
            </p>
          </div>
          <button
            onClick={() => router.push("/login?redirect=/admin")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-lg transition-all"
          >
            Go to Login Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100/50 overflow-hidden font-sans">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800">
        {/* Sidebar Header */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-500/20">
            E
          </span>
          <span className="text-base font-bold text-white tracking-tight">
            Emerald<span className="text-emerald-400">Admin</span>
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/15"
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <TrendingUp size={14} />
            <span>Go to Storefront</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Drawer Box */}
          <div className="relative w-full max-w-xs bg-slate-900 text-slate-300 h-full flex flex-col p-6 shadow-2xl transition-transform duration-300 animate-slide-right overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold shadow-sm">
                  E
                </span>
                <span className="text-base font-bold text-white">
                  Emerald<span className="text-emerald-400">Admin</span>
                </span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                      isActive ? "bg-emerald-600 text-white" : "hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-800 pt-6 space-y-2 mt-auto">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
              >
                <TrendingUp size={14} />
                <span>Go to Storefront</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all text-left"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {pathname === "/admin" ? "Dashboard" : pathname.replace("/admin/", "").replace("-", " ")}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Indicator */}
            <div className="relative">
              <button
                className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-colors relative"
                title="Alerts"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>

            {/* Profile widget */}
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                AD
              </span>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900">Admin User</p>
                <p className="text-[10px] text-slate-500">Store Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
