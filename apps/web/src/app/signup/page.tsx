"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function update(name: "name" | "email" | "password", value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account");
      }

      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/account",
        redirect: true,
      });
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Could not create account");
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-10">
      <div className="w-full rounded-2xl border p-6">
        <h1 className="mb-2 text-3xl font-semibold">Create Account</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Sign up to save orders and manage your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />

          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />

          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </div>
    </main>
  );
}