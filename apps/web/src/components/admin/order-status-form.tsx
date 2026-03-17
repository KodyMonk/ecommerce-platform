"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  orderNumber: string;
  initialStatus: "PENDING" | "CONFIRMED" | "CANCELLED";
  initialPaymentStatus: "PENDING" | "PAID" | "FAILED";
  initialFulfillmentStatus:
    | "UNFULFILLED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED";
};

export default function OrderStatusForm({
  orderNumber,
  initialStatus,
  initialPaymentStatus,
  initialFulfillmentStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [fulfillmentStatus, setFulfillmentStatus] = useState(
    initialFulfillmentStatus
  );
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

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
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update order");
      }

      setNote("");
      router.refresh();
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
        <label className="mb-2 block text-sm font-medium">Order Status</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "PENDING" | "CONFIRMED" | "CANCELLED")
          }
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Payment Status</label>
        <select
          value={paymentStatus}
          onChange={(e) =>
            setPaymentStatus(e.target.value as "PENDING" | "PAID" | "FAILED")
          }
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Fulfillment Status
        </label>
        <select
          value={fulfillmentStatus}
          onChange={(e) =>
            setFulfillmentStatus(
              e.target.value as
                | "UNFULFILLED"
                | "SHIPPED"
                | "OUT_FOR_DELIVERY"
                | "DELIVERED"
            )
          }
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="UNFULFILLED">UNFULFILLED</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Admin Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note for this status update"
          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating..." : "Update Order"}
      </Button>
    </form>
  );
}