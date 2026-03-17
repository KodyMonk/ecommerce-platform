import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders";

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { orderNumber } = await params;

  return {
    title: `Order ${orderNumber}`,
    description: `Track order ${orderNumber}`,
  };
}

export default async function OrderPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) notFound();

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Order confirmation
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{order.orderNumber}</h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been placed successfully.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.variantTitle ? (
                      <p className="text-sm text-muted-foreground">{item.variantTitle}</p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{Number(item.lineTotal).toFixed(2)} BHD</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Status timeline</h2>
            <div className="space-y-4">
              {order.statusHistory.map((entry) => (
                <div key={entry.id} className="border-l pl-4">
                  <p className="font-medium">{entry.status.replaceAll("_", " ")}</p>
                  {entry.note ? (
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border p-6 h-fit">
          <h2 className="mb-4 text-lg font-semibold">Summary</h2>

          <div className="space-y-3 text-sm">
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">Status</span>
    <span>{order.status.replaceAll("_", " ")}</span>
  </div>
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">Payment Status</span>
    <span>{order.paymentStatus.replaceAll("_", " ")}</span>
  </div>
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">Payment Method</span>
    <span>{order.paymentMethod.replaceAll("_", " ")}</span>
  </div>
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">Fulfillment</span>
    <span>{order.fulfillmentStatus.replaceAll("_", " ")}</span>
  </div>
</div>

          <div className="my-5 border-t" />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{Number(order.subtotal).toFixed(2)} BHD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{Number(order.shippingTotal).toFixed(2)} BHD</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{Number(order.total).toFixed(2)} BHD</span>
            </div>
          </div>

          {order.shippingAddress ? (
            <>
              <div className="my-5 border-t" />
              <div>
                <h3 className="mb-2 font-medium">Shipping address</h3>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 ? (
                  <p className="text-sm text-muted-foreground">{order.shippingAddress.line2}</p>
                ) : null}
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
            </>
          ) : null}
        </aside>
      </div>
    </main>
  );
}