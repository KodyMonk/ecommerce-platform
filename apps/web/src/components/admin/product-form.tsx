"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type OptionItem = {
  id: string;
  name: string;
};

type ProductFormProps = {
  product?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    basePrice: number | string;
    stock: number;
    brandId?: string | null;
    categoryId?: string | null;
    isActive: boolean;
    isFeatured: boolean;
    images?: { url: string }[];
  };
  brands?: OptionItem[];
  categories?: OptionItem[];
};

export default function ProductForm({
  product,
  brands = [],
  categories = [],
}: ProductFormProps) {
  const router = useRouter();

  const initialImageUrl = product?.images?.[0]?.url || "";

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    basePrice: String(product?.basePrice ?? ""),
    stock: String(product?.stock ?? 0),
    brandId: product?.brandId || "",
    categoryId: product?.categoryId || "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    imageUrl: initialImageUrl,
  });

  const [loading, setLoading] = useState(false);

  const previewImage = useMemo(() => form.imageUrl.trim(), [form.imageUrl]);

  function update(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/admin/products", {
        method: product ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product?.id,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Basic details</h2>

          <div className="space-y-4">
            <Input
              placeholder="Product name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />

            <Input
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              required
            />

            <Input
              placeholder="Short description"
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
            />

            <Input
              placeholder="Full description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Pricing & stock</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Base price"
              type="number"
              step="0.01"
              value={form.basePrice}
              onChange={(e) => update("basePrice", e.target.value)}
              required
            />

            <Input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Media</h2>

          <Input
            placeholder="Primary image URL"
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
          />

          {previewImage ? (
            <div className="relative mt-4 aspect-square max-w-xs overflow-hidden rounded-xl border bg-muted">
              <Image
                src={previewImage}
                alt={form.name || "Preview"}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          ) : null}
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Organization</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Brand</label>
              <select
                value={form.brandId}
                onChange={(e) => update("brandId", e.target.value)}
                className="h-11 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">No brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                className="h-11 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Visibility</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
              />
              Active product
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => update("isFeatured", e.target.checked)}
              />
              Featured product
            </label>
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? product
                ? "Updating..."
                : "Creating..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </aside>
    </form>
  );
}