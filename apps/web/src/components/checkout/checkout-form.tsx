"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bahrain",
    notes: "",
  });

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order");
      }

      router.push(`/orders/${data.data.orderNumber}`);
    } catch (error) {
      console.error(error);
      alert("Could not place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Full name"
        value={form.fullName}
        onChange={(e) => updateField("fullName", e.target.value)}
        required
      />
      <Input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
      />
      <Input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
      />
      <Input
        placeholder="Address line 1"
        value={form.line1}
        onChange={(e) => updateField("line1", e.target.value)}
        required
      />
      <Input
        placeholder="Address line 2"
        value={form.line2}
        onChange={(e) => updateField("line2", e.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="City"
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
          required
        />
        <Input
          placeholder="State / Area"
          value={form.state}
          onChange={(e) => updateField("state", e.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Postal code"
          value={form.postalCode}
          onChange={(e) => updateField("postalCode", e.target.value)}
        />
        <Input
          placeholder="Country"
          value={form.country}
          onChange={(e) => updateField("country", e.target.value)}
          required
        />
      </div>
      <Input
        placeholder="Order notes"
        value={form.notes}
        onChange={(e) => updateField("notes", e.target.value)}
      />

      <Button type="submit" className="w-full h-12" disabled={loading}>
        {loading ? "Placing order..." : "Place order"}
      </Button>
    </form>
  );
}