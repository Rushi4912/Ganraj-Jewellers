"use client";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useRouter } from "next/navigation";
import {
  downloadInvoice,
  formatCurrency,
  formatDate,
  formatDateTime,
  statusLabels,
} from "../utils/orderUtils";
import {
  Package,
  ArrowRight,
  Truck,
  Download,
  Repeat,
  Eye,
  ShoppingBag,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600 border-gray-200",
  processing: "bg-amber-50 text-amber-700 border-amber-100",
  shipped: "bg-blue-50 text-blue-700 border-blue-100",
  delivered: "bg-[#F2F0EB] text-[#8B7355] border-[#E5E0D8]",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

const OrdersPage = () => {
  const { orders } = useOrder();
  const { addToCart } = useCart();
  const toast = useToast();
  const router = useRouter();

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item, item.selectedVariants);
      }
    });

    toast.success("Items added to your bag");
    router.push("/checkout");
  };

  const viewOrder = (orderId: string) => {
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F2F0EB] flex items-center justify-center px-6 py-20">
          <div className="max-w-xl w-full text-center space-y-8 animate-fadeIn">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-[#C5B4A5] shadow-sm">
              <Package size={32} />
            </div>
            <div>
              <h1 className="font-display text-4xl text-[#2D2A26] mb-4">
                No Orders Yet
              </h1>
              <p className="text-[#6B5D52] text-lg leading-relaxed max-w-sm mx-auto">
                Your jewellery journey hasn't begun. Explore our atelier to find your first treasure.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#2D2A26] text-white font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-all duration-300"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F2F0EB] min-h-screen py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">

          <header className="mb-16 animate-fadeInUp">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-[1px] bg-[#8B7355]"></span>
              <span className="text-[#8B7355] text-xs font-bold uppercase tracking-widest">My Collection</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-[#2D2A26] mb-4">
              Jewellery Journey
            </h1>
            <p className="text-[#6B5D52] max-w-lg leading-relaxed">
              A curated timeline of your acquisitions. Track parcels, revisit past selections, and manage your growing collection.
            </p>
          </header>

          <div className="space-y-12">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-[#E5E0D8] hover:shadow-md transition-shadow animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-[#F2F0EB]">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-[#6B5D52] text-sm mb-1">
                      <Calendar size={14} />
                      <span>Ordered on {formatDate(order.date)}</span>
                    </div>
                    <h2 className="font-display text-2xl text-[#2D2A26]">
                      {order.orderNumber}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyles[order.status] || 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="font-display text-xl text-[#2D2A26]">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                  {/* Product List */}
                  <div className="lg:col-span-2 space-y-6">
                    {order.items.map((item) => (
                      <div key={`${item.id}-${item.variantId}`} className="flex gap-6 group">
                        <div className="relative w-24 h-24 bg-[#F2F0EB] rounded-2xl overflow-hidden flex-shrink-0 border border-[#E5E0D8]">
                          <Image
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 py-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-display text-lg text-[#2D2A26]">{item.name}</h3>
                            <span className="text-sm font-medium text-[#6B5D52]">{formatCurrency(item.price)}</span>
                          </div>
                          <p className="text-xs text-[#8B7355] font-bold uppercase tracking-wider mb-2">Qty: {item.quantity}</p>
                          {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.selectedVariants).map(([key, value]) => (
                                <span key={key} className="text-xs text-[#6B5D52] bg-[#F2F0EB] px-2 py-1 rounded-md">
                                  {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions & Info */}
                  <div className="flex flex-col justify-between gap-6 lg:border-l lg:border-[#F2F0EB] lg:pl-10">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F2F0EB] flex items-center justify-center text-[#8B7355] flex-shrink-0">
                          <MapPin size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#6B5D52] mb-1">Shipping To</p>
                          <p className="text-sm text-[#2D2A26] leading-relaxed">
                            {order.shipping.fullName}<br />
                            {order.shipping.city}, {order.shipping.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F2F0EB] flex items-center justify-center text-[#8B7355] flex-shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#6B5D52] mb-1">Estimated Arrival</p>
                          <p className="text-sm text-[#2D2A26]">
                            {formatDate(order.estimatedDelivery)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-[#F2F0EB]">
                      <button
                        onClick={() => viewOrder(order.id)}
                        className="w-full py-3 rounded-xl border border-[#C5B4A5] text-[#2D2A26] font-bold uppercase tracking-wider text-xs hover:bg-[#2D2A26] hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      <button
                        onClick={() => reorder(order.id)}
                        className="w-full py-3 rounded-xl bg-[#2D2A26] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#8B7355] transition-colors flex items-center justify-center gap-2"
                      >
                        <Repeat size={14} /> Reorder
                      </button>
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="w-full py-3 text-[#6B5D52] font-bold uppercase tracking-wider text-xs hover:text-[#2D2A26] flex items-center justify-center gap-2"
                      >
                        <Download size={14} /> Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrdersPage;
