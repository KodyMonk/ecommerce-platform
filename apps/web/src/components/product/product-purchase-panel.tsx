"use client";

import { useMemo, useState } from "react";
import type { ProductDTO } from "@ecommerce/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck, ShieldCheck, PackageCheck, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  product: ProductDTO;
};

type VariantOptionGroup = {
  name: string;
  values: string[];
};

export default function ProductPurchasePanel({ product }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) ||
    product.variants[0] ||
    null;

  const optionGroups = useMemo<VariantOptionGroup[]>(() => {
    const map = new Map<string, Set<string>>();

    for (const variant of product.variants) {
      for (const value of variant.values) {
        if (!map.has(value.optionName)) {
          map.set(value.optionName, new Set());
        }
        map.get(value.optionName)!.add(value.value);
      }
    }

    return Array.from(map.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [product.variants]);

  const initialSelections = useMemo(() => {
    const selections: Record<string, string> = {};

    if (defaultVariant) {
      for (const value of defaultVariant.values) {
        selections[value.optionName] = value.value;
      }
    }

    return selections;
  }, [defaultVariant]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialSelections);
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null;
    if (optionGroups.length === 0) return defaultVariant;

    const match = product.variants.find((variant) => {
      return optionGroups.every((group) => {
        const selectedValue = selectedOptions[group.name];
        if (!selectedValue) return false;

        return variant.values.some(
          (value) =>
            value.optionName === group.name && value.value === selectedValue
        );
      });
    });

    return match || defaultVariant;
  }, [defaultVariant, optionGroups, product.variants, selectedOptions]);

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

  function handleSelectOption(optionName: string, value: string) {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  }

  async function handleAddToCart() {
    try {
      setCartLoading(true);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id ?? null,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add to cart");
      }

      router.refresh();
      alert("Added to cart");
    } catch (error) {
      console.error(error);
      alert("Could not add to cart");
    } finally {
      setCartLoading(false);
    }
  }

  async function handleWishlist() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/products/${product.slug}`);
      return;
    }

    try {
      setWishlistLoading(true);

      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update wishlist");
      }

      router.refresh();
      alert(data.data.added ? "Added to wishlist" : "Removed from wishlist");
    } catch (error) {
      console.error(error);
      alert("Could not update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        {product.brand ? (
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">
            {product.brand.name}
          </p>
        ) : null}

        <h1 className="text-3xl font-semibold uppercase tracking-[0.06em] text-neutral-900 md:text-4xl">
          {product.name}
        </h1>

        <div className="flex items-center gap-3">
          <p className="text-2xl font-semibold text-neutral-900">
            BD {Number(displayPrice).toFixed(3)}
          </p>

          {displayCompareAt && displayCompareAt > displayPrice ? (
            <p className="text-base text-neutral-400 line-through">
              BD {Number(displayCompareAt).toFixed(3)}
            </p>
          ) : null}

          {product.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
        </div>

        {product.shortDescription ? (
          <p className="max-w-xl text-sm leading-6 text-neutral-600">
            {product.shortDescription}
          </p>
        ) : null}
      </div>

      <Separator />

      {optionGroups.length > 0 ? (
        <div className="space-y-5">
          {optionGroups.map((group) => (
            <div key={group.name} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {group.name}
              </p>

              <div className="flex flex-wrap gap-2">
                {group.values.map((value) => {
                  const isSelected = selectedOptions[group.name] === value;

                  return (
                    <button
                      key={`${group.name}-${value}`}
                      type="button"
                      onClick={() => handleSelectOption(group.name, value)}
                      className={`border px-4 py-2 text-sm transition ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-900 hover:border-black"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Quantity
        </p>

        <div className="flex w-fit items-center overflow-hidden border border-neutral-300">
          <button
            type="button"
            onClick={decreaseQty}
            className="h-11 w-11 border-r border-neutral-300 text-lg"
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
            className="h-11 w-11 border-l border-neutral-300 text-lg"
          >
            +
          </button>
        </div>

        <p className="text-sm text-neutral-500">
          {inStock ? `Only ${displayStock} item(s) in stock` : "Out of stock"}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || cartLoading}
            className="h-12 min-w-[220px] rounded-none bg-black px-8 text-white hover:bg-neutral-800"
          >
            {cartLoading ? "Adding..." : "Add to Cart"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className="h-12 rounded-none border-neutral-300 px-5"
          >
            <Heart className="mr-2 h-4 w-4" />
            {wishlistLoading ? "Saving..." : "Wishlist"}
          </Button>
        </div>

        <p className="text-xs text-neutral-500">
          Items are added to your cart immediately.
        </p>
      </div>

      <Separator />

      {product.description ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-900">
            Description
          </h2>
          <p className="leading-7 text-neutral-600">{product.description}</p>
        </div>
      ) : null}

      <div className="grid gap-3 border border-neutral-200 bg-[#fafafa] p-5 text-sm text-neutral-600">
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