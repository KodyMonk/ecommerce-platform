"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  productId: string;
};

export default function ProductVariantCreator({ productId }: Props) {
  const router = useRouter();
  const [optionName, setOptionName] = useState("");
  const [valuesText, setValuesText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const values = valuesText
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/products/${productId}/variants/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionName,
          values,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create variants");
      }

      setOptionName("");
      setValuesText("");
      router.refresh();
      alert("Variants created");
    } catch (error) {
      console.error(error);
      alert("Could not create variants");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Create Variants</h2>
        <p className="text-sm text-muted-foreground">
          Add a single option like Size, Color, or Volume. Separate values with commas.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        <Input
          placeholder="Option name (e.g. Size, Color, Volume)"
          value={optionName}
          onChange={(e) => setOptionName(e.target.value)}
          required
        />

        <Input
          placeholder="Values (e.g. S, M, L) or (50ml, 75ml, 100ml)"
          value={valuesText}
          onChange={(e) => setValuesText(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Generate Variants"}
        </Button>
      </form>
    </div>
  );
}