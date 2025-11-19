"use client";
import { Order } from "../types/product";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatDate = (
  value: string,
  options: Intl.DateTimeFormatOptions = {}
) => {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
};

export const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const downloadInvoice = (order: Order) => {
  const lineItems = order.items
    .map(
      (item) =>
        `${item.name} x${item.quantity} - ${formatCurrency(
          item.price * item.quantity
        )}`
    )
    .join("\n");

  const content = `Invoice - ${order.orderNumber}

Order Date: ${formatDateTime(order.date)}
Estimated Delivery: ${formatDate(order.estimatedDelivery)}
Status: ${order.status.toUpperCase()}

Customer:
${order.shipping.fullName}
${order.shipping.address}
${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}
${order.shipping.country}
Email: ${order.shipping.email}
Phone: ${order.shipping.phone}

Items:
${lineItems}

Subtotal: ${formatCurrency(order.subtotal)}
Discount: -${formatCurrency(order.discount)}
Shipping: ${formatCurrency(order.shippingCost)}
Total: ${formatCurrency(order.total)}

Thank you for shopping with Jewellery4u!`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${order.orderNumber}-invoice.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

export const orderStatusSteps = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export type OrderStatusStep = (typeof orderStatusSteps)[number];

export const statusLabels: Record<OrderStatusStep, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
