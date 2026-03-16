"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  orderNumber: string;
  currentStatus: string;
  currentPaymentStatus: string;
  currentFulfillmentStatus: string;
  currentTrackingNumber?: string | null;
  currentShippingCarrier?: string | null;
};

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
];

const paymentStatuses = [
  "PENDING",
  "AUTHORIZED",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

const fulfillmentStatuses = [
  "UNFULFILLED",
  "PARTIALLY_FULFILLED",
  "FULFILLED",
  "RETURNED",
];

export default function OrderStatusForm({
  orderNumber,
  currentStatus,
  currentPaymentStatus,
  currentFulfillmentStatus,
  currentTrackingNumber,
  currentShippingCarrier,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [fulfillmentStatus, setFulfillmentStatus] = useState(
    currentFulfillmentStatus
  );
  const [trackingNumber, setTrackingNumber] = useState(
    currentTrackingNumber || ""
  );
  const [shippingCarrier, setShippingCarrier] = useState(
    currentShippingCarrier || ""
  );
  const [note, setNote] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          paymentStatus,
          fulfillmentStatus,
          trackingNumber,
          shippingCarrier,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update order");
      }

      router.refresh();
      setNote("");
      alert("Order updated");
    } catch (error) {
      console.error(error);
      alert("Could not update order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Order status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        >
          {orderStatuses.map((value) => (
            <option key={value} value={value}>
              {value.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Payment status</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        >
          {paymentStatuses.map((value) => (
            <option key={value} value={value}>
              {value.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Fulfillment status
        </label>
        <select
          value={fulfillmentStatus}
          onChange={(e) => setFulfillmentStatus(e.target.value)}
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        >
          {fulfillmentStatuses.map((value) => (
            <option key={value} value={value}>
              {value.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <Input
        placeholder="Tracking number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />

      <Input
        placeholder="Shipping carrier"
        value={shippingCarrier}
        onChange={(e) => setShippingCarrier(e.target.value)}
      />

      <Input
        placeholder="Admin note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update order"}
      </Button>
    </form>
  );
}