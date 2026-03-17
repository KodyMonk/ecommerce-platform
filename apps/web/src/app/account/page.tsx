import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import { getOrdersForCurrentUser } from "@/lib/orders";
import { getSavedAddressesForCurrentUser } from "@/lib/addresses";

export const metadata = {
  title: "My Account",
  description: "Manage your customer account",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const [orders, addresses] = await Promise.all([
    getOrdersForCurrentUser(),
    getSavedAddressesForCurrentUser(),
  ]);

  return (
    <main className="container mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-semibold">My Account</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile, addresses, and orders.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Profile</h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{session.user.name || "No name set"}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{session.user.email}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="font-medium">{session.user.role}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Orders</p>
              <p className="font-medium">{orders.length}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Saved Addresses</p>
              <p className="font-medium">{addresses.length}</p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>

            <div className="flex flex-col gap-3">
              <Link href="/orders">
                <Button className="w-full">My Orders</Button>
              </Link>

              <Link href="/account/addresses">
                <Button variant="outline" className="w-full">
                  Saved Addresses
                </Button>
              </Link>

              <Link href="/wishlist">
                <Button variant="outline" className="w-full">
                  Wishlist
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}