"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { dbMock } from "@/lib/dbMock";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/maintenance") return;

    try {
      const settings = dbMock.getSettings();
      if (settings?.maintenanceMode) {
        router.replace("/maintenance");
      }
    } catch (e) {
      console.error("Maintenance check failed:", e);
    }
  }, [pathname, router]);

  if (pathname === "/maintenance") {
    return <main className="flex-1 flex flex-col bg-slate-50">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col bg-slate-50/30">
        {children}
      </main>
      <Footer />
    </>
  );
}
