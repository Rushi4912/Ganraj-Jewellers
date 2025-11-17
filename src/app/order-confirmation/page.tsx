"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useOrder } from "../context/OrderContext";
import { Order } from "../types/product";
import {
  CheckCircle2,
  MailCheck,
  Truck,
  Package,
  Printer,
  Download,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  downloadInvoice,
  formatCurrency,
  formatDate,
  formatDateTime,
  orderStatusSteps,
  statusLabels,
} from "../utils/orderUtils";

const getStatusIndex = (status: Order["status"]) =>
  orderStatusSteps.findIndex((step) => step === status);

const OrderConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentOrder, getOrderById } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [isReady, setIsReady] = useState(false);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setOrder(currentOrder);
      setIsReady(true);
      return;
    }

    const match = getOrderById(orderId);
    setOrder(match || currentOrder);
    setIsReady(true);
  }, [orderId, currentOrder, getOrderById]);

  const totalItems = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [order]);

  const handlePrint = () => {
    window.print();
  };

  const handleTrackOrders = () => {
    router.push("/orders");
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Fetching your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl shadow-lg p-10 max-w-xl text-center space-y-6">
            <Package size={64} className="mx-auto text-gray-300" />
            <h1 className="text-3xl font-bold text-gray-900">
              We couldn&apos;t find that order
            </h1>
            <p className="text-gray-600">
              Your order might be too new or removed from this device. Check
              your order history or continue shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleTrackOrders}
                className="px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-800 hover:border-gray-300 transition-all"
              >
                View Orders
              </button>
              <a
                href="/shop"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/30"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100/40 to-orange-100/40 pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-full p-3 shadow-lg text-green-500">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <p className="uppercase text-xs tracking-[0.4em] text-gray-500 mb-2">
                    Order Confirmed
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Thank you, {order.shipping.fullName.split(" ")[0]}!
                  </h1>
                  <p className="text-gray-600 mt-3 max-w-2xl">
                    We&apos;ve received your order and sent a confirmation email
                    to{" "}
                    <span className="font-semibold text-gray-900">
                      {order.shipping.email}
                    </span>
                    . We&apos;ll keep you updated as it moves through our studio.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 font-semibold text-gray-800 hover:border-gray-300 transition-all bg-white"
                >
                  <Printer size={18} />
                  Print receipt
                </button>
                <button
                  onClick={() => downloadInvoice(order)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/40"
                >
                  <Download size={18} />
                  Download invoice
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Order number</p>
              <p className="text-xl font-semibold text-gray-900">
                {order.orderNumber}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Placed on {formatDateTime(order.date)}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Items</p>
              <p className="text-xl font-semibold text-gray-900">
                {totalItems} pieces
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {order.items.length} product types
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Estimated delivery</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatDate(order.estimatedDelivery, { weekday: "short" })}
              </p>
              <p className="text-xs text-gray-400 mt-1 text-green-600">
                On schedule
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(order.total)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Including taxes & shipping
              </p>
            </div>
          </div>

          <section className="bg-white rounded-3xl shadow-sm p-8 space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order tracking
                </h2>
                <p className="text-gray-600">
                  Live status for order {order.orderNumber}
                </p>
              </div>
              <button
                onClick={handleTrackOrders}
                className="inline-flex items-center gap-2 text-amber-600 font-semibold"
              >
                View all orders
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="relative">
              <div className="absolute top-5 left-12 right-12 h-1 bg-gray-200 hidden sm:block" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                {orderStatusSteps.map((status, index) => {
                  const isComplete = index <= currentStatusIndex;
                  return (
                    <div key={status} className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                          isComplete
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 border-transparent text-white"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {statusLabels[status]}
                        </p>
                        <p className="text-xs text-gray-500">
                          {index === 0
                            ? formatDateTime(order.date)
                            : index === orderStatusSteps.length - 1
                            ? formatDate(order.estimatedDelivery, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })
                            : "Awaiting update"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-3 text-amber-700">
                <Truck />
                <div>
                  <p className="font-semibold">
                    Shipping to {order.shipping.city}, {order.shipping.country}
                  </p>
                  <p className="text-sm text-amber-800">
                    Tracking updates will be sent via email & SMS.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Order summary
                </h2>
              </div>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantId || "base"}`}
                    className="flex flex-col sm:flex-row gap-4 border border-gray-100 rounded-2xl p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-28 h-32 object-cover rounded-xl bg-gray-50"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          {item.selectedVariants && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(item.selectedVariants).map(
                                ([key, value]) => (
                                  <span
                                    key={key}
                                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                                  >
                                    {key}: {value}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t pt-6 space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discounts</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <MailCheck className="text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Confirmation email sent
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shipping.email}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                  Save this email for your records. You&apos;ll receive shipping
                  updates and delivery confirmation there.
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Shipping details
                  </h3>
                </div>
                <div className="space-y-1 text-gray-700">
                  <p className="font-semibold">{order.shipping.fullName}</p>
                  <p>{order.shipping.address}</p>
                  <p>
                    {order.shipping.city}, {order.shipping.state}{" "}
                    {order.shipping.zipCode}
                  </p>
                  <p>{order.shipping.country}</p>
                  <p className="pt-2">{order.shipping.phone}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Payment summary
                  </h3>
                </div>
                <div className="text-gray-700 text-sm space-y-2">
                  <p>
                    Method:{" "}
                    <span className="font-semibold capitalize">
                      {order.payment.type === "card"
                        ? "Credit Card"
                        : order.payment.type === "cod"
                        ? "Cash on Delivery"
                        : "PayPal"}
                    </span>
                  </p>
                  {order.payment.type === "card" && order.payment.cardNumber && (
                    <p>
                      Ending in{" "}
                      <span className="font-semibold">
                        {order.payment.cardNumber.slice(-4)}
                      </span>
                    </p>
                  )}
                  {order.discount > 0 && order.discountCode && (
                    <p>
                      Discount code:{" "}
                      <span className="font-semibold">
                        {order.discountCode}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderConfirmationPage;

