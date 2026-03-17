"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Sale", href: "/products?sort=price-asc" },
  { label: "Appliances", href: "/products?search=appliance" },
  { label: "Travel", href: "/products?search=travel" },
  { label: "Home", href: "/products?search=home" },
  { label: "Fashion", href: "/products?search=fashion" },
  { label: "Beauty", href: "/products?search=beauty" },
  { label: "Brands", href: "/products" },
];

export default function SiteHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    let mounted = true;

    async function loadCartCount() {
      try {
        const res = await fetch("/api/cart/count", {
          cache: "no-store",
        });

        const data = await res.json();

        if (mounted && res.ok && data.success) {
          setCartCount(data.data.count ?? 0);
        }
      } catch (error) {
        console.error("Failed to load cart count", error);
      }
    }

    loadCartCount();

    return () => {
      mounted = false;
    };
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      router.push("/products");
      return;
    }

    router.push(`/products?search=${encodeURIComponent(query)}`);
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="bg-[#1f3668] px-4 py-2 text-center text-[11px] uppercase tracking-[0.22em] text-white">
        Deliveries are temporarily delayed to ensure safety. Thank you for your patience.
      </div>

      <div className="mx-auto max-w-[1280px] px-4">
        <div className="flex flex-col gap-4 py-6">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="shrink-0">
              <div className="leading-none">
                <p className="text-4xl font-semibold tracking-tight">Ecom</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                  Luxury Storefront
                </p>
              </div>
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden max-w-[520px] flex-1 items-center md:flex"
            >
              <div className="flex w-full overflow-hidden border border-neutral-400">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for products, brands and categories"
                  className="h-11 flex-1 px-4 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="flex h-11 w-14 items-center justify-center bg-[#1f3668] text-white"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingBag className="h-5 w-5" />
                </Button>

                {cartCount > 0 ? (
                  <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 translate-x-1/3 -translate-y-1/3 items-center justify-center rounded-full bg-black px-1 text-[11px] font-medium text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              <Link href={session?.user ? "/account" : "/login"}>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="md:hidden">
            <div className="flex w-full overflow-hidden border border-neutral-400">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="h-11 flex-1 px-4 text-sm outline-none"
              />
              <button
                type="submit"
                className="flex h-11 w-14 items-center justify-center bg-[#1f3668] text-white"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <nav className="border-t border-neutral-200 pt-3">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] uppercase tracking-[0.14em] text-neutral-700">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}