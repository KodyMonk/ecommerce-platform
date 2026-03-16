import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

async function removeItem(id: string) {
  "use server";
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/cart/${id}`, {
    method: "DELETE",
  });
}

export const metadata = {
  title: "Cart",
  description: "Review the items in your cart",
};

export default async function CartPage() {
  const cart = await getCart();

  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = Number(item.variant?.price ?? item.product.basePrice);
    return sum + unitPrice * item.quantity;
  }, 0);

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="mb-8 text-3xl font-semibold">Your cart</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border p-8">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block">
            <Button className="mt-4">Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => {
              const image =
  item.product.images.find((img) => img.isPrimary)?.url ||
  item.product.images[0]?.url ||
  "/placeholder.jpg";

              const unitPrice = Number(item.variant?.price ?? item.product.basePrice);
              const lineTotal = unitPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-2xl border p-4 md:grid-cols-[120px_1fr_auto]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">{item.product.name}</p>
                    {item.variant ? (
                      <p className="text-sm text-muted-foreground">{item.variant.title}</p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-3">
                    <p className="font-semibold">{lineTotal.toFixed(2)} BHD</p>
                    <form
                      action={async () => {
                        "use server";
                        await removeItem(item.id);
                      }}
                    >
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{subtotal.toFixed(2)} BHD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="my-5 border-t" />

            <div className="mb-6 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{subtotal.toFixed(2)} BHD</span>
            </div>

            <Link href="/checkout">
              <Button className="w-full">Proceed to checkout</Button>
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}