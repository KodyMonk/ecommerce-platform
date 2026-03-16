"use client";

import { useMemo, useState } from "react";
import type { ProductDTO } from "@ecommerce/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Truck, ShieldCheck, PackageCheck } from "lucide-react";
import AddToCartButton from "@/components/product/add-to-cart-button";

type Props = {
  product: ProductDTO;
};

export default function ProductPurchasePanel({ product }: Props) {
  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) || product.variants[0] || null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariant?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((variant) => variant.id === selectedVariantId) ||
      defaultVariant,
    [defaultVariant, product.variants, selectedVariantId]
  );

  const displayPrice = selectedVariant?.price ?? product.basePrice;
  const displayCompareAt =
    selectedVariant?.compareAtPrice ?? product.compareAtPrice ?? null;
  const displayStock = selectedVariant?.stock ?? product.stock;
  const inStock = displayStock > 0;

  function increaseQty() {
    setQuantity((prev) => Math.min(prev + 1, Math.max(displayStock, 1)));
  }

  function decreaseQty() {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }

  const optionLabel =
    selectedVariant?.values.map((value) => `${value.optionName}: ${value.value}`).join(" • ") ||
    null;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {product.brand ? (
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            {product.brand.name}
          </p>
        ) : null}

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {product.name}
        </h1>

        <div className="flex items-center gap-3">
          <p className="text-2xl font-semibold">
            {displayPrice} {product.currency}
          </p>

          {displayCompareAt && displayCompareAt > displayPrice ? (
            <p className="text-base text-muted-foreground line-through">
              {displayCompareAt} {product.currency}
            </p>
          ) : null}

          {product.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
        </div>

        {product.shortDescription ? (
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {product.shortDescription}
          </p>
        ) : null}
      </div>

      <Separator />

      {product.variants.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Select option</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const label =
                variant.values.map((value) => value.value).join(" / ") || variant.title;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedVariant?.id === variant.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {optionLabel ? (
            <p className="text-sm text-muted-foreground">{optionLabel}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-sm font-medium">Quantity</p>

        <div className="flex w-fit items-center overflow-hidden rounded-lg border">
          <button
            type="button"
            onClick={decreaseQty}
            className="h-11 w-11 border-r text-lg"
          >
            -
          </button>

          <Input
            value={quantity}
            readOnly
            className="h-11 w-16 rounded-none border-0 text-center shadow-none focus-visible:ring-0"
          />

          <button
            type="button"
            onClick={increaseQty}
            className="h-11 w-11 border-l text-lg"
          >
            +
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {inStock ? `Only ${displayStock} item(s) in stock` : "Out of stock"}
        </p>
      </div>

      <div className="space-y-3">
  <AddToCartButton
    productId={product.id}
    variantId={selectedVariant?.id ?? null}
    quantity={quantity}
    disabled={!inStock}
  />

  <p className="text-xs text-muted-foreground">
    Items are added to your cart immediately.
  </p>
</div>

      <Separator />

      {product.description ? (
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Description</h2>
          <p className="leading-7 text-muted-foreground">{product.description}</p>
        </div>
      ) : null}

      <div className="grid gap-3 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Truck className="h-4 w-4" />
          <span>Fast delivery and shipping updates available</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure checkout and coupon support</span>
        </div>
        <div className="flex items-center gap-3">
          <PackageCheck className="h-4 w-4" />
          <span>Admin-managed order tracking built into the platform</span>
        </div>
      </div>
    </div>
  );
}