"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddressForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bahrain",
  });

  function update(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save address");
      }

      setForm({
        fullName: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Bahrain",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not save address");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Full name"
        value={form.fullName}
        onChange={(e) => update("fullName", e.target.value)}
        required
      />

      <Input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
      />

      <Input
        placeholder="Address line 1"
        value={form.line1}
        onChange={(e) => update("line1", e.target.value)}
        required
      />

      <Input
        placeholder="Address line 2"
        value={form.line2}
        onChange={(e) => update("line2", e.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          required
        />

        <Input
          placeholder="State / Area"
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Postal code"
          value={form.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
        />

        <Input
          placeholder="Country"
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save address"}
      </Button>
    </form>
  );
}