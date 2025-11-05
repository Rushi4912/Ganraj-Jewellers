import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../app/context/CartContext";
import { ToastProvider } from "../app/context/ToastContext";
import { OrderProvider } from "../app/context/OrderContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jwellery4u - Luxury Jewelry Collection",
  description: "Discover our exquisite collection of gold, diamond, and gemstone jewelry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ToastProvider>
        <OrderProvider>
        <CartProvider>
           {children}
        </CartProvider>
        </OrderProvider>
        </ToastProvider>
      </body>
    </html>
  );
}