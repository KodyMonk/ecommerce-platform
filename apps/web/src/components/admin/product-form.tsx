"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BrandItem = {
  id: string;
  name: string;
};

type CategoryItem = {
  id: string;
  name: string;
};

type Props = {
  mode: "create" | "edit";
  productId?: string;
  brands: BrandItem[];
  categories: CategoryItem[];
  initialValues?: {
    name?: string;
    slug?: string;
    shortDescription?: string | null;
    description?: string | null;
    basePrice?: number;
    stock?: number;
    brandId?: string | null;
    categoryId?: string | null;
    isActive?: boolean;
    isFeatured?: boolean;
    imageUrls?: string[];
  };
};

export default function ProductForm({
  mode,
  productId,
  brands,
  categories,
  initialValues,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialValues?.name || "",
    slug: initialValues?.slug || "",
    shortDescription: initialValues?.shortDescription || "",
    description: initialValues?.description || "",
    basePrice: String(initialValues?.basePrice ?? 0),
    stock: String(initialValues?.stock ?? 0),
    brandId: initialValues?.brandId || "",
    categoryId: initialValues?.categoryId || "",
    isActive: initialValues?.isActive ?? true,
    isFeatured: initialValues?.isFeatured ?? false,
    imageUrlsText: (initialValues?.imageUrls || []).join("\n"),
  });

  const previewImages = useMemo(
    () =>
      form.imageUrlsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [form.imageUrlsText]
  );

  function updateField(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const endpoint =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${productId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          basePrice: Number(form.basePrice),
          stock: Number(form.stock),
          imageUrls: form.imageUrlsText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            (mode === "create"
              ? "Failed to create product"
              : "Failed to update product")
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        mode === "create"
          ? "Could not create product"
          : "Could not update product"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Product name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <Input
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="product-slug"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Short Description</label>
        <Input
          value={form.shortDescription}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          placeholder="Short description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Full product description"
          className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Base Price</label>
          <Input
            type="number"
            step="0.01"
            value={form.basePrice}
            onChange={(e) => updateField("basePrice", e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stock</label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => updateField("stock", e.target.value)}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <select
            value={form.brandId}
            onChange={(e) => updateField("brandId", e.target.value)}
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Product Image URLs
        </label>
        <textarea
          value={form.imageUrlsText}
          onChange={(e) => updateField("imageUrlsText", e.target.value)}
          placeholder={`One image URL per line\nhttps://...\nhttps://...`}
          className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground">
          First image becomes the primary storefront image.
        </p>
      </div>

      {previewImages.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Image Preview</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {previewImages.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="overflow-hidden rounded-xl border bg-muted"
              >
                <div className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                </div>
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  {index === 0 ? "Primary image" : `Image ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
          />
          Active product
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => updateField("isFeatured", e.target.checked)}
          />
          Featured product
        </label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading
          ? mode === "create"
            ? "Creating..."
            : "Updating..."
          : mode === "create"
            ? "Create Product"
            : "Update Product"}
      </Button>
    </form>
  );
}