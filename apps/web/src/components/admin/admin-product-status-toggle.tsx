"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  productId: string;
  type: "featured" | "active";
  value: boolean;
};

export default function AdminProductStatusToggle({
  productId,
  type,
  value,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  async function handleToggle() {
    try {
      setLoading(true);

      const endpoint =
        type === "featured"
          ? `/api/admin/products/${productId}/featured`
          : `/api/admin/products/${productId}/active`;

      const body =
        type === "featured"
          ? { isFeatured: !currentValue }
          : { isActive: !currentValue };

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update");
      }

      setCurrentValue(!currentValue);
    } catch (error) {
      console.error(error);
      alert("Could not update product");
    } finally {
      setLoading(false);
    }
  }

  const label =
    type === "featured"
      ? currentValue
        ? "Featured"
        : "Not Featured"
      : currentValue
      ? "Active"
      : "Inactive";

  return (
    <Button
      type="button"
      variant={currentValue ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "Saving..." : label}
    </Button>
  );
}