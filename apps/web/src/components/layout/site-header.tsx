"use client";

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=perfumes", label: "Perfumes" },
  { href: "/products?category=clothing", label: "Clothing" },
  { href: "/products?category=beauty", label: "Beauty" },
  { href: "/orders", label: "Orders" },
];

export default function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Ecom
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/account">
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" aria-label="Login">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}