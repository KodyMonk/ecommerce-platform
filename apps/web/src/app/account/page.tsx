import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import AddressForm from "@/components/account/address-form";
import AddressCard from "@/components/account/address-card";
import { getSavedAddressesForCurrentUser } from "@/lib/addresses";

export const metadata = {
  title: "Saved Addresses",
  description: "Manage saved addresses",
};

export default async function AccountAddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/addresses");
  }

  const addresses = await getSavedAddressesForCurrentUser();

  return (
    <main className="container mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Addresses" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Saved Addresses</h1>
        <p className="mt-2 text-muted-foreground">
          Save, edit, and manage shipping addresses for faster checkout.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section className="space-y-4">
          {addresses.length === 0 ? (
            <div className="rounded-2xl border p-6 text-sm text-muted-foreground">
              No saved addresses yet.
            </div>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={{
                  id: address.id,
                  fullName: address.fullName,
                  phone: address.phone,
                  line1: address.line1,
                  line2: address.line2,
                  city: address.city,
                  state: address.state,
                  postalCode: address.postalCode,
                  country: address.country,
                }}
              />
            ))
          )}
        </section>

        <aside className="rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Add Address</h2>
          <AddressForm />
        </aside>
      </div>
    </main>
  );
}