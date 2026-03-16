import { getCart } from "@/lib/cart";
import CheckoutForm from "@/components/checkout/checkout-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Checkout",
  description: "Complete your order",
};

export default async function CheckoutPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = Number(item.variant?.price ?? item.product.basePrice);
    return sum + unitPrice * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-6 py-10">
        <h1 className="mb-6 text-3xl font-semibold">Checkout</h1>
        <div className="rounded-2xl border p-8">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link href="/products">
            <Button className="mt-4">Continue shopping</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="mb-8 text-3xl font-semibold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-2xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Shipping details</h2>
          <CheckoutForm />
        </section>

        <aside className="h-fit rounded-2xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>

          <div className="space-y-4">
            {items.map((item) => {
              const unitPrice = Number(item.variant?.price ?? item.product.basePrice);
              return (
                <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    {item.variant ? (
                      <p className="text-muted-foreground">{item.variant.title}</p>
                    ) : null}
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{(unitPrice * item.quantity).toFixed(2)} BHD</p>
                </div>
              );
            })}
          </div>

          <div className="my-5 border-t" />

          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>{subtotal.toFixed(2)} BHD</span>
          </div>
        </aside>
      </div>
    </main>
  );
}