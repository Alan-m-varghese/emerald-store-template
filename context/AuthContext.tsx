"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

export interface UserInfo {
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthContextType {
  user: UserInfo | null;
  login: (name: string, email: string, role: "CUSTOMER" | "ADMIN") => void;
  logout: () => void;
  isAdmin: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = useState<UserInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync NextAuth session or load fallback from localStorage
  useEffect(() => {
    if (status === "loading") return;

    if (session && session.user) {
      setLocalUser({
        name: session.user.name || "User",
        email: session.user.email || "",
        role: (session.user as any).role || "CUSTOMER",
      });
      setIsInitialized(true);
    } else {
      // If no NextAuth session, try fallback local storage
      try {
        const savedUser = localStorage.getItem("emerald_auth_user");
        if (savedUser) {
          setLocalUser(JSON.parse(savedUser));
        } else {
          setLocalUser(null);
        }
      } catch (error) {
        console.error("Failed to load user session from localStorage:", error);
      } finally {
        setIsInitialized(true);
      }
    }
  }, [session, status]);

  const login = async (name: string, email: string, role: "CUSTOMER" | "ADMIN") => {
    const userInfo: UserInfo = { name, email, role };
    setLocalUser(userInfo);
    try {
      localStorage.setItem("emerald_auth_user", JSON.stringify(userInfo));
    } catch (error) {
      console.error("Failed to save user session to localStorage:", error);
    }

    // Attempt to login to NextAuth as well (silent fallback)
    try {
      await signIn("credentials", {
        email,
        password: "customerPassword123", // default or fallback credentials password
        redirect: false,
      });
    } catch (e) {
      console.warn("NextAuth login fallback failed, using local session:", e);
    }
  };

  const logout = async () => {
    setLocalUser(null);
    try {
      localStorage.removeItem("emerald_auth_user");
      localStorage.removeItem("emerald_applied_coupon");
    } catch (error) {
      console.error("Failed to clear user session from localStorage:", error);
    }

    // Call NextAuth signout
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.warn("NextAuth logout failed:", e);
    }
  };

  const isAdmin = localUser?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user: localUser,
        login,
        logout,
        isAdmin,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
