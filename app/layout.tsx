import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Emerald Store | Premium Physical Goods Platform",
  description: "Discover a premium, curated selection of physical goods. Enjoy secure payments, fast national shipping, and an optimized shopping experience.",
  keywords: ["e-commerce", "online shopping", "emerald store", "premium goods"],
  authors: [{ name: "Emerald Store Team" }],
  openGraph: {
    title: "Emerald Store | Premium Physical Goods Platform",
    description: "Discover a premium, curated selection of physical goods. Enjoy secure payments, fast national shipping, and an optimized shopping experience.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${inter.variable} font-sans h-full bg-white text-slate-900 antialiased flex flex-col`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
