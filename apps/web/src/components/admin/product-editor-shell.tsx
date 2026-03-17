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

type ExistingVariantValue = {
  optionValue: {
    value: string;
    option: {
      name: string;
    };
  };
};

type ExistingVariant = {
  id: string;
  title: string;
  stock: number;
  price: number | null;
  isActive: boolean;
  values?: ExistingVariantValue[];
};

type ProductInput = {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  basePrice: number;
  stock: number;
  brandId?: string | null;
  categoryId?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  images?: { url: string }[];
  variants: ExistingVariant[];
};

type LocalVariant = {
  id?: string;
  tempId: string;
  title: string;
  stock: string;
  price: string;
  isActive: boolean;
  optionName?: string;
  optionValue?: string;
  valuesLabel?: string | null;
};

type OptionGroup = {
  id: string;
  name: string;
  valuesText: string;
};

type Props = {
  product: ProductInput;
  brands: BrandItem[];
  categories: CategoryItem[];
};

export default function ProductEditorShell({
  product,
  brands,
  categories,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    basePrice: String(product.basePrice),
    stock: String(product.stock),
    brandId: product.brandId || "",
    categoryId: product.categoryId || "",
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    imageUrl: product.images?.[0]?.url || "",
  });

  const [variants, setVariants] = useState<LocalVariant[]>(
    product.variants.map((variant) => ({
      id: variant.id,
      tempId: variant.id,
      title: variant.title,
      stock: String(variant.stock ?? 0),
      price:
        variant.price === null || variant.price === undefined
          ? ""
          : String(variant.price),
      isActive: variant.isActive,
      valuesLabel:
        variant.values && variant.values.length > 0
          ? variant.values
              .map(
                (v) => `${v.optionValue.option.name}: ${v.optionValue.value}`
              )
              .join(" • ")
          : null,
    }))
  );

  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([
    { id: Math.random().toString(36).slice(2), name: "", valuesText: "" },
  ]);

  const [generatingVariants, setGeneratingVariants] = useState(false);
  const [saving, setSaving] = useState(false);

  const previewImage = useMemo(() => form.imageUrl.trim(), [form.imageUrl]);

  function updateForm(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateVariant(
    tempId: string,
    field: "title" | "stock" | "price" | "isActive",
    value: string | boolean
  ) {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.tempId === tempId ? { ...variant, [field]: value } : variant
      )
    );
  }

  function addOptionGroup() {
    setOptionGroups((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), name: "", valuesText: "" },
    ]);
  }

  function removeOptionGroup(id: string) {
    setOptionGroups((prev) => prev.filter((group) => group.id !== id));
  }

  function updateOptionGroup(
    id: string,
    field: "name" | "valuesText",
    value: string
  ) {
    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, [field]: value } : group
      )
    );
  }

  async function handleGenerateCombinations() {
    try {
      setGeneratingVariants(true);

      const options = optionGroups
        .map((group) => ({
          name: group.name.trim(),
          values: group.valuesText
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        }))
        .filter((group) => group.name && group.values.length > 0);

      if (options.length === 0) {
        alert("Please add at least one option and values");
        return;
      }

      const res = await fetch(
        `/api/admin/products/${product.id}/variants/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ options }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate variants");
      }

      const newVariants = (data.data?.variants || []).map((variant: any) => ({
        id: variant.id,
        tempId: variant.id,
        title: variant.title,
        stock: String(variant.stock ?? 0),
        price:
          variant.price === null || variant.price === undefined
            ? ""
            : String(Number(variant.price)),
        isActive: variant.isActive,
        valuesLabel:
          variant.values && variant.values.length > 0
            ? variant.values
                .map(
                  (v: any) =>
                    `${v.optionValue.option.name}: ${v.optionValue.value}`
                )
                .join(" • ")
            : null,
      }));

      setVariants(newVariants);
      setOptionGroups([
        { id: Math.random().toString(36).slice(2), name: "", valuesText: "" },
      ]);
    } catch (error) {
      console.error(error);
      alert("Could not generate variants");
    } finally {
      setGeneratingVariants(false);
    }
  }

  async function handleDeleteVariant(tempId: string, variantId?: string) {
    try {
      if (!variantId) {
        setVariants((prev) =>
          prev.filter((variant) => variant.tempId !== tempId)
        );
        return;
      }

      const res = await fetch(`/api/admin/products/${product.id}/variants`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete variant");
      }

      setVariants((prev) =>
        prev.filter((variant) => variant.tempId !== tempId)
      );
    } catch (error) {
      console.error(error);
      alert("Could not delete variant");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await fetch(`/api/admin/products/${product.id}/editor`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          variants: variants.map((variant) => ({
            id: variant.id,
            title: variant.title,
            stock: Number(variant.stock || 0),
            price: variant.price === "" ? null : Number(variant.price),
            isActive: variant.isActive,
            optionName: variant.optionName,
            optionValue: variant.optionValue,
          })),
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
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Basic details</h2>

            <div className="space-y-4">
              <Input
                placeholder="Product name"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                required
              />

              <Input
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                required
              />

              <Input
                placeholder="Short description"
                value={form.shortDescription}
                onChange={(e) => updateForm("shortDescription", e.target.value)}
              />

              <Input
                placeholder="Full description"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
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
                onChange={(e) => updateForm("basePrice", e.target.value)}
                required
              />

              <Input
                placeholder="Base stock"
                type="number"
                value={form.stock}
                onChange={(e) => updateForm("stock", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Media</h2>

            <Input
              placeholder="Primary image URL"
              value={form.imageUrl}
              onChange={(e) => updateForm("imageUrl", e.target.value)}
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
                  onChange={(e) => updateForm("brandId", e.target.value)}
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
                  onChange={(e) => updateForm("categoryId", e.target.value)}
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
                  onChange={(e) => updateForm("isActive", e.target.checked)}
                />
                Active product
              </label>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => updateForm("isFeatured", e.target.checked)}
                />
                Featured product
              </label>
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Update Product"}
            </Button>
          </div>
        </aside>
      </div>

      <div className="rounded-2xl border p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Variant Options</h2>
            <p className="text-sm text-muted-foreground">
              Add option groups like Color, Size, or Volume, then generate
              combinations.
            </p>
          </div>

          <Button type="button" variant="outline" onClick={addOptionGroup}>
            Add Option Group
          </Button>
        </div>

        <div className="space-y-4">
          {optionGroups.map((group, index) => (
            <div
              key={group.id}
              className="grid gap-4 rounded-xl border p-4 md:grid-cols-[220px_1fr_auto]"
            >
              <Input
                placeholder="Option name (e.g. Color)"
                value={group.name}
                onChange={(e) =>
                  updateOptionGroup(group.id, "name", e.target.value)
                }
              />

              <Input
                placeholder="Values separated by commas (e.g. Red, Pink)"
                value={group.valuesText}
                onChange={(e) =>
                  updateOptionGroup(group.id, "valuesText", e.target.value)
                }
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => removeOptionGroup(group.id)}
                disabled={optionGroups.length === 1 && index === 0}
              >
                Remove
              </Button>
            </div>
          ))}

          <div className="pt-2">
            <Button
              type="button"
              onClick={handleGenerateCombinations}
              disabled={generatingVariants}
            >
              {generatingVariants
                ? "Generating..."
                : "Generate Variant Combinations"}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Variants</h2>
            <p className="text-sm text-muted-foreground">
              Update per-variant stock and price here.
            </p>
          </div>
        </div>

        {variants.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This product has no variants yet.
          </p>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => (
              <div
                key={variant.tempId}
                className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1.2fr_140px_180px_160px_auto]"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Title</label>
                  <Input
                    value={variant.title}
                    onChange={(e) =>
                      updateVariant(variant.tempId, "title", e.target.value)
                    }
                  />
                  {variant.valuesLabel ? (
                    <p className="text-xs text-muted-foreground">
                      {variant.valuesLabel}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(variant.tempId, "stock", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Price (BHD)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(variant.tempId, "price", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Active</label>
                  <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm">
                    <input
                      type="checkbox"
                      checked={variant.isActive}
                      onChange={(e) =>
                        updateVariant(
                          variant.tempId,
                          "isActive",
                          e.target.checked
                        )
                      }
                    />
                    Enabled
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Delete</label>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      handleDeleteVariant(variant.tempId, variant.id)
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}