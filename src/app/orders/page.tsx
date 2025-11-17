"use client";
import { useMemo } from "react";
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
  PackageCheck,
  ArrowRight,
  Truck,
  Download,
  Repeat,
  Eye,
  InboxIcon,
  BadgeCheck,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrdersPage = () => {
  const { orders } = useOrder();
  const { addToCart } = useCart();
  const toast = useToast();
  const router = useRouter();

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item, item.selectedVariants);
      }
    });

    toast.success("Items added to your cart");
    router.push("/checkout");
  };

  const viewOrder = (orderId: string) => {
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
            <InboxIcon size={72} className="mx-auto text-gray-300" />
            <h1 className="text-3xl font-bold text-gray-900">
              No orders just yet
            </h1>
            <p className="text-gray-600">
              Explore our latest drops and start building your collection.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/30"
            >
              Browse the atelier
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <header className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 text-amber-600 rounded-2xl p-4">
                <PackageCheck size={36} />
              </div>
              <div>
                <p className="uppercase text-xs tracking-[0.4em] text-gray-400 mb-2">
                  MY ORDERS
                </p>
                <h1 className="text-3xl font-bold text-gray-900">
                  Your jewellery journey
                </h1>
                <p className="text-gray-600">
                  Track, reorder, and manage every atelier dispatch in one
                  place.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-500">Active orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    orders.filter(
                      (order) => order.status !== "delivered" && order.status !== "cancelled"
                    ).length
                  }
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-500">Lifetime spend</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </div>
          </header>

          <section className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-sm p-6 space-y-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Order</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-400">
                      Placed {formatDateTime(order.date)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-600">
                      {order.items.length} items
                    </span>
                    <span className="px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-600">
                      Total {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={`${item.id}-${item.variantId || "base"}`}
                        className="border border-gray-100 rounded-2xl p-3 flex items-center gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover bg-gray-50"
                        />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-gray-500">
                            Qty {item.quantity} ·{" "}
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="border border-dashed border-gray-200 rounded-2xl p-3 flex items-center justify-center text-gray-500 text-sm">
                        +{order.items.length - 2} more pieces
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-64 bg-gray-50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Truck size={18} />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Ships to
                        </p>
                        <p className="font-semibold">
                          {order.shipping.city}, {order.shipping.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <BadgeCheck size={18} className="text-green-500" />
                      <p className="text-sm">
                        Arrives by {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t pt-4">
                  <button
                    onClick={() => viewOrder(order.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 hover:border-gray-300"
                  >
                    <Eye size={16} />
                    View details
                  </button>
                  <button
                    onClick={() => reorder(order.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 hover:border-gray-300"
                  >
                    <Repeat size={16} />
                    Reorder
                  </button>
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 hover:border-gray-300"
                  >
                    <Download size={16} />
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrdersPage;

