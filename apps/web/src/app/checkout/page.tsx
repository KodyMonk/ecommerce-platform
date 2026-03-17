import Breadcrumbs from "@/components/layout/breadcrumbs";
import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout",
  description: "Complete your order",
};

export default function CheckoutPage() {
  return (
    <main className="container mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Complete your order as a guest or with your account.
        </p>
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border p-6">
        <CheckoutForm />
      </div>
    </main>
  );
}