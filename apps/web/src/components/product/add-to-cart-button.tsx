"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  productId: string;
  variantId?: string | null;
  quantity: number;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  variantId,
  quantity,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          variantId,
          quantity,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }

      window.location.href = "/cart";
    } catch (error) {
      console.error(error);
      alert("Could not add item to cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button className="h-12 w-full text-base" disabled={disabled || loading} onClick={handleAddToCart}>
      {loading ? "Adding..." : "Add to cart"}
    </Button>
  );
}