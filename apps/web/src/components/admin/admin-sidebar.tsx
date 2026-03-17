"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  TicketPercent,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Discounts",
    href: "/admin/discounts",
    icon: TicketPercent,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

type Props = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: Props) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-72 border-r bg-muted/20 lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            Admin Panel
          </Link>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label="Close sidebar overlay"
          />

          <aside className="absolute left-0 top-0 h-full w-72 border-r bg-background shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link href="/admin" className="text-lg font-semibold tracking-tight">
                Admin Panel
              </Link>

              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}