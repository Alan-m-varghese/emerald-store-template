"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { dbMock } from "@/lib/dbMock";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  
  const redirectPath = searchParams.get("redirect") || "/";

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(user.role === "ADMIN" ? "/admin" : redirectPath);
    }
  }, [user, redirectPath, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return;

    const lowercaseEmail = email.toLowerCase().trim();

    if (isRegister) {
      // Sign Up flow
      if (lowercaseEmail === "admin@emeraldstore.in") {
        setError("This email address is reserved and cannot be registered.");
        return;
      }

      const existingUser = dbMock.findUserByEmail(lowercaseEmail);
      if (existingUser) {
        setError("An account with this email address already exists. Please sign in.");
        return;
      }

      // Add to mock DB and login
      const cleanName = name.trim() || "Valued Customer";
      dbMock.addUser(cleanName, lowercaseEmail, password, "CUSTOMER");
      login(cleanName, lowercaseEmail, "CUSTOMER");
      router.push(redirectPath === "/" ? "/account" : redirectPath);
    } else {
      // Sign In flow
      if (lowercaseEmail === "admin@emeraldstore.in") {
        if (password === "adminPassword123") {
          login("System Admin", lowercaseEmail, "ADMIN");
          router.push("/admin");
        } else {
          setError("Invalid administrator password.");
        }
        return;
      }

      const user = dbMock.findUserByEmail(lowercaseEmail);
      if (!user) {
        setError("Account not found. Please sign up or check your credentials.");
        return;
      }

      if (user.passwordHash !== password) {
        setError("Invalid email or password.");
        return;
      }

      login(user.name, user.email, user.role);
      router.push(redirectPath === "/" ? "/account" : redirectPath);
    }
  };

  const triggerQuickLogin = (role: "CUSTOMER" | "ADMIN") => {
    if (role === "ADMIN") {
      login("System Admin", "admin@emeraldstore.in", "ADMIN");
      router.push("/admin");
    } else {
      // Initialize quick customer user if they don't exist
      const existingUser = dbMock.findUserByEmail("rajesh@gmail.com");
      if (!existingUser) {
        dbMock.addUser("Rajesh Kumar", "rajesh@gmail.com", "customerPassword123", "CUSTOMER");
      }
      login("Rajesh Kumar", "rajesh@gmail.com", "CUSTOMER");
      router.push(redirectPath === "/" ? "/account" : redirectPath);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 md:py-24 space-y-8 animate-fade-in">
      
      {/* Visual top */}
      <div className="text-center space-y-2">
        <span className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary-500/20 mx-auto">
          E
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-4">
          Welcome to Emerald Store
        </h1>
        <p className="text-slate-500 text-xs font-semibold">
          Access your personalized handcrafted physical goods catalog.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Redirect notice */}
        {searchParams.get("redirect") && (
          <div className="flex items-start gap-2 bg-amber-50 text-amber-800 text-[10px] font-bold p-3 rounded-2xl border border-amber-100">
            <ShieldAlert size={14} className="flex-shrink-0 text-amber-500" />
            <span>You need to be signed in to access the requested page details.</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-800 text-[10px] font-bold p-3 rounded-2xl border border-red-100">
            <ShieldAlert size={14} className="flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700 bg-white"
                required={isRegister}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="e.g. customer@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700 bg-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700 bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            <span>{isRegister ? "Create Account" : "Sign In"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center text-[11px] font-semibold text-slate-400">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="hover:text-primary-600 underline"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Quick Selection Test Panel (Visible only in dev testing mode) */}
        {process.env.NODE_ENV === "development" && searchParams.get("dev") === "true" && (
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ Quick-Fill Sandbox Accounts
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => triggerQuickLogin("CUSTOMER")}
                className="p-3 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20 text-slate-700 rounded-2xl text-[10px] font-bold flex flex-col items-center gap-1 transition-all"
              >
                <UserCheck size={16} className="text-slate-400" />
                <span>Customer Demo</span>
              </button>
              
              <button
                onClick={() => triggerQuickLogin("ADMIN")}
                className="p-3 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20 text-slate-700 rounded-2xl text-[10px] font-bold flex flex-col items-center gap-1 transition-all"
              >
                <ShieldCheck size={16} className="text-slate-400" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-slate-500 text-center text-xs">Loading secure login portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
