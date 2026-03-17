"use client";

import Link from "next/link";
import { Bell, Menu, Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

type Props = {
  onOpenSidebar?: () => void;
};

export default function AdminTopbar({ onOpenSidebar }: Props) {
  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex max-w-md flex-1 items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open admin navigation"
            onClick={onOpenSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="relative hidden w-full max-w-sm sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search admin..." className="pl-9" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/products">
            <Button variant="outline" size="sm" className="gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">View Store</span>
            </Button>
          </Link>

          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          

          <div className="ml-1 flex items-center gap-2">
  <div className="rounded-full border px-3 py-1.5 text-sm font-medium">
    Admin
  </div>

  <Button
    variant="outline"
    size="sm"
    onClick={() => signOut({ callbackUrl: "/login" })}
  >
    Logout
  </Button>
</div>
        </div>
      </div>
    </header>
  );
}