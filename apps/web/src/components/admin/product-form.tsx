"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductForm({ product }: any) {

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    basePrice: product?.basePrice || "",
    description: product?.description || "",
  });

  function update(name: string, value: string) {
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/products", {
      method: product ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: product?.id,
        ...form,
      }),
    });

    alert("Saved");
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">

      <Input
        placeholder="Product name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />

      <Input
        placeholder="Slug"
        value={form.slug}
        onChange={(e) => update("slug", e.target.value)}
      />

      <Input
        placeholder="Price"
        value={form.basePrice}
        onChange={(e) => update("basePrice", e.target.value)}
      />

      <Input
        placeholder="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <Button type="submit">
        {product ? "Update Product" : "Create Product"}
      </Button>

    </form>
  );
}