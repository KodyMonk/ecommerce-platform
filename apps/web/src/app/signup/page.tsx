"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

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
        callbackUrl,
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
          Sign up to save orders, addresses, and wishlist items.
        </p>

        {callbackUrl === "/checkout" ? (
          <div className="mb-4 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            Create an account to make checkout faster and reuse saved addresses.
          </div>
        ) : null}

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

        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium text-foreground underline"
          >
            Sign in
          </Link>
        </p>

        {callbackUrl === "/checkout" ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Prefer not to create an account?{" "}
            <Link href="/checkout?mode=guest" className="font-medium underline">
              Continue as guest
            </Link>
          </p>
        ) : null}
      </div>
    </main>
  );
}