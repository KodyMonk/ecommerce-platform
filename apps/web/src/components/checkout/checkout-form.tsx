"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SavedAddress = {
  id: string;
  fullName: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
};

type CheckoutMode = "guest" | "account";

export default function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState("");
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  const initialMode: CheckoutMode =
    session?.user ? "account" : searchParams.get("mode") === "guest" ? "guest" : "guest";

  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>(initialMode);

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
    paymentMethod: "COD",
    saveAddress: true,
  });

  useEffect(() => {
    if (session?.user) {
      setCheckoutMode("account");
      setForm((prev) => ({
        ...prev,
        email: session.user.email || prev.email,
        fullName: session.user.name || prev.fullName,
      }));
    }
  }, [session?.user]);

  useEffect(() => {
    async function loadAddresses() {
      if (!session?.user) return;

      try {
        const res = await fetch("/api/account/addresses", {
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setSavedAddresses(data.data || []);
        }
      } catch (error) {
        console.error("Failed to load saved addresses", error);
      }
    }

    loadAddresses();
  }, [session?.user]);

  function updateField(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload =
        checkoutMode === "account" && useSavedAddress && selectedSavedAddressId
          ? {
              email: form.email,
              notes: form.notes,
              paymentMethod: form.paymentMethod,
              savedAddressId: selectedSavedAddressId,
            }
          : form;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const showGuestChoice = status !== "loading" && !session?.user;
  const showSavedAddressSection =
    checkoutMode === "account" && session?.user && savedAddresses.length > 0;

  return (
    <div className="space-y-6">
      {showGuestChoice ? (
        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">How would you like to checkout?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You can continue as a guest or sign in to use saved addresses,
            track orders from your account, and manage your wishlist.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setCheckoutMode("guest")}
              className={`rounded-2xl border p-4 text-left transition ${
                checkoutMode === "guest"
                  ? "border-foreground bg-foreground text-background"
                  : "hover:bg-muted"
              }`}
            >
              <p className="font-medium">Continue as Guest</p>
              <p
                className={`mt-2 text-sm ${
                  checkoutMode === "guest"
                    ? "text-background/80"
                    : "text-muted-foreground"
                }`}
              >
                Place your order without creating an account.
              </p>
            </button>

            <div className="rounded-2xl border p-4">
              <p className="font-medium">Use My Account</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in or create an account for a faster checkout experience.
              </p>

              <div className="mt-4 flex gap-3">
                <Link href="/login?callbackUrl=/checkout" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>

                <Link href="/signup?callbackUrl=/checkout" className="flex-1">
                  <Button className="w-full">Create Account</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {session?.user ? (
        <div className="rounded-2xl border p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Signed in as</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {session.user.name || "Customer"} · {session.user.email}
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/account/addresses">
                <Button variant="outline">Manage Addresses</Button>
              </Link>
              <Link href="/account">
                <Button variant="outline">My Account</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {showSavedAddressSection ? (
          <div className="space-y-3 rounded-xl border p-4">
            <p className="text-sm font-medium">Address Option</p>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="addressMode"
                checked={useSavedAddress}
                onChange={() => setUseSavedAddress(true)}
              />
              Use a saved address
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="addressMode"
                checked={!useSavedAddress}
                onChange={() => setUseSavedAddress(false)}
              />
              Enter a new address
            </label>

            {useSavedAddress ? (
              <select
                value={selectedSavedAddressId}
                onChange={(e) => setSelectedSavedAddressId(e.target.value)}
                className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                required
              >
                <option value="">Select a saved address</option>
                {savedAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.fullName} — {address.line1}, {address.city}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ) : null}

        {!useSavedAddress ? (
          <>
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

            {checkoutMode === "account" && session?.user ? (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form.saveAddress)}
                  onChange={(e) => updateField("saveAddress", e.target.checked)}
                />
                Save this address to my account
              </label>
            ) : null}
          </>
        ) : (
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        )}

        <div className="space-y-3 rounded-xl border p-4">
          <p className="text-sm font-medium">Payment Method</p>

          <label className="flex items-start gap-3 rounded-lg border p-3 text-sm">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={form.paymentMethod === "COD"}
              onChange={(e) => updateField("paymentMethod", e.target.value)}
            />
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-muted-foreground">
                Customer pays when the order is delivered.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-lg border p-3 text-sm">
            <input
              type="radio"
              name="paymentMethod"
              value="MANUAL"
              checked={form.paymentMethod === "MANUAL"}
              onChange={(e) => updateField("paymentMethod", e.target.value)}
            />
            <div>
              <p className="font-medium">Manual Payment</p>
              <p className="text-muted-foreground">
                Order is placed now. Payment can be confirmed manually later.
              </p>
            </div>
          </label>
        </div>

        <Input
          placeholder="Order notes"
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />

        <Button type="submit" className="h-12 w-full" disabled={loading}>
          {loading ? "Placing order..." : "Place order"}
        </Button>
      </form>
    </div>
  );
}