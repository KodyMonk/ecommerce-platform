"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: true,
    });

    setLoading(false);
  }

  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-10">
      <div className="w-full rounded-2xl border p-6">
        <h1 className="mb-2 text-3xl font-semibold">Login</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Sign in to access your account.
        </p>

        {callbackUrl === "/checkout" ? (
          <div className="mb-4 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            Sign in to use your saved addresses and account details during checkout.
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid email or password.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium text-foreground underline"
          >
            Create one
          </Link>
        </p>

        {callbackUrl === "/checkout" ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Prefer not to sign in?{" "}
            <Link href="/checkout?mode=guest" className="font-medium underline">
              Continue as guest
            </Link>
          </p>
        ) : null}
      </div>
    </main>
  );
}