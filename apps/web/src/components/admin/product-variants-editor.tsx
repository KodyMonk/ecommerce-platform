"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VariantValue = {
  optionValue: {
    value: string;
    option: {
      name: string;
    };
  };
};

type VariantItem = {
  id: string;
  title: string;
  stock: number;
  price: number | string | null;
  isActive: boolean;
  values?: VariantValue[];
};

type Props = {
  productId: string;
  variants: VariantItem[];
  currency?: string;
};

export default function ProductVariantsEditor({
  productId,
  variants,
  currency = "BHD",
}: Props) {
  const router = useRouter();

  const [items, setItems] = useState(
    variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      stock: String(variant.stock ?? 0),
      price:
        variant.price === null || variant.price === undefined
          ? ""
          : String(variant.price),
      isActive: variant.isActive,
      values: variant.values || [],
    }))
  );

  const [loading, setLoading] = useState(false);

  function updateItem(
    id: string,
    field: "title" | "stock" | "price" | "isActive",
    value: string | boolean
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  async function handleSave() {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/products/${productId}/variants`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variants: items.map((item) => ({
            id: item.id,
            title: item.title,
            stock: Number(item.stock || 0),
            price: item.price === "" ? null : Number(item.price),
            isActive: item.isActive,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update variants");
      }

      router.refresh();
      alert("Variants updated");
    } catch (error) {
      console.error(error);
      alert("Could not update variants");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border p-6">
        <h2 className="mb-2 text-lg font-semibold">Variants</h2>
        <p className="text-sm text-muted-foreground">
          This product has no variants yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Variants</h2>
          <p className="text-sm text-muted-foreground">
            Update per-variant stock and price here.
          </p>
        </div>

        <Button type="button" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save variants"}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const valuesLabel =
            item.values.length > 0
              ? item.values
                  .map(
                    (v) => `${v.optionValue.option.name}: ${v.optionValue.value}`
                  )
                  .join(" • ")
              : null;

          return (
            <div
              key={item.id}
              className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1.2fr_120px_140px_120px]"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium">Title</label>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    updateItem(item.id, "title", e.target.value)
                  }
                />
                {valuesLabel ? (
                  <p className="text-xs text-muted-foreground">{valuesLabel}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Stock</label>
                <Input
                  type="number"
                  value={item.stock}
                  onChange={(e) =>
                    updateItem(item.id, "stock", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Price ({currency})
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(item.id, "price", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Active</label>
                <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) =>
                      updateItem(item.id, "isActive", e.target.checked)
                    }
                  />
                  Enabled
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}