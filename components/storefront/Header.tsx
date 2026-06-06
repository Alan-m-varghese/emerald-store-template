"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, ArrowRight, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scrolling to add shadow/glass effect to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Redirect to search PLP in subsequent phase
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Top Banner */}
      <div className="w-full bg-primary-950 text-emerald-100 text-xs py-2 px-4 text-center font-medium flex justify-center items-center gap-1.5 animate-pulse-subtle">
        <span>✨ Grand Opening Sale: Use code <b>EMERALD10</b> for 10% off!</span>
        <ArrowRight size={12} className="inline" />
      </div>

      {/* Main Header Bar */}
      <div
        className={cn(
          "w-full bg-white border-b border-slate-100 transition-all duration-300",
          isScrolled ? "shadow-md bg-white/95 backdrop-blur-md py-3" : "py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Trigger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1.5 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
              E
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-950 group-hover:text-primary-600 transition-colors">
              Emerald<span className="text-primary-600">Store</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <input
              id="desktop-search-input"
              type="text"
              placeholder="Search premium products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-slate-800"
            />
            <Search
              size={18}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "hover:text-primary-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-500 after:transition-all hover:after:w-full",
                  pathname === link.href ? "text-primary-600 after:w-full" : ""
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            
            {/* Account Link / Dropdown */}
            {user ? (
              <div className="relative group">
                <button
                  id="profile-dropdown-btn"
                  className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-extrabold text-xs flex items-center justify-center border border-primary-200/50 hover:bg-primary-200 transition-colors"
                >
                  {user.name.split(" ").map(n => n[0]).join("")}
                </button>
                {/* Hover Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-xs font-medium text-slate-605 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    My Profile
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-slate-50 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-50 mt-1"
                  >
                    <LogOut size={12} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                id="account-btn"
                href="/login"
                className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-all"
                title="Sign In"
              >
                <User size={20} />
              </Link>
            )}

            {/* Cart Link with Indicator */}
            <Link
              id="cart-btn"
              href="/cart"
              className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full relative transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce-subtle">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Link to Admin Panel shortcut */}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-full text-slate-700 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50/50 transition-all"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar / Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-full max-w-xs bg-white h-full flex flex-col p-6 shadow-2xl transition-transform duration-300 animate-slide-right overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold tracking-tight text-slate-950">
                Emerald<span className="text-primary-600">Store</span>
              </span>
              <button
                id="close-mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-slate-800"
              />
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400 pointer-events-none"
              />
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-5 text-base font-semibold text-slate-700 mb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "hover:text-primary-600 transition-colors py-1 border-b border-slate-50",
                    pathname === link.href ? "text-primary-600 border-primary-100" : ""
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-primary-600 transition-colors py-1 border-b border-slate-50 text-slate-700"
                  >
                    My Profile ({user.name})
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="hover:text-primary-600 transition-colors py-1 border-b border-slate-50 text-emerald-600 font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="hover:text-red-500 transition-colors py-1 border-b border-slate-50 text-slate-500 text-left font-semibold flex items-center gap-2 mt-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-primary-600 transition-colors py-1 border-b border-slate-50 text-slate-750"
                >
                  Sign In
                </Link>
              )}
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-6 text-center text-xs text-slate-400 font-medium">
              <p>📍 Delivery Pan-India</p>
              <p className="mt-1">📞 24/7 WhatsApp Support</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
