import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../app/context/CartContext";
import { ToastProvider } from "../app/context/ToastContext";
import { OrderProvider } from "../app/context/OrderContext";
import { AuthProvider } from "../app/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ganraj Jewellers - Luxury Jewelry Collection",
  description: "Discover our exquisite collection of gold, diamond, and gemstone jewelry crafted by Ganraj Jewellers",
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
          <AuthProvider>
            <OrderProvider>
              <CartProvider>{children}</CartProvider>
            </OrderProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}