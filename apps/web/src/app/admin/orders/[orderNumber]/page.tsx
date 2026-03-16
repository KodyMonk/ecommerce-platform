import { notFound } from "next/navigation";
import { getAdminOrderByNumber } from "../../../../lib/admin-orders";
import OrderStatusForm from "@/components/admin/order-status-form";

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { orderNumber } = await params;

  return {
    title: `Admin Order ${orderNumber}`,
    description: `Manage order ${orderNumber}`,
  };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getAdminOrderByNumber(orderNumber);

  if (!order) notFound();

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Admin Order
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{order.orderNumber}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.variantTitle ? (
                      <p className="text-sm text-muted-foreground">
                        {item.variantTitle}
                      </p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {Number(item.lineTotal).toFixed(2)} BHD
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Status history</h2>
            <div className="space-y-4">
              {order.statusHistory.map((entry) => (
                <div key={entry.id} className="border-l pl-4">
                  <p className="font-medium">{entry.status.replaceAll("_", " ")}</p>
                  {entry.note ? (
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                  ) : null}
                  {entry.shippingCarrier ? (
                    <p className="text-sm text-muted-foreground">
                      Carrier: {entry.shippingCarrier}
                    </p>
                  ) : null}
                  {entry.trackingNumber ? (
                    <p className="text-sm text-muted-foreground">
                      Tracking: {entry.trackingNumber}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Update order</h2>
            <OrderStatusForm
              orderNumber={order.orderNumber}
              currentStatus={order.status}
              currentPaymentStatus={order.paymentStatus}
              currentFulfillmentStatus={order.fulfillmentStatus}
              currentTrackingNumber={order.trackingNumber}
              currentShippingCarrier={order.shippingCarrier}
            />
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span>{order.status.replaceAll("_", " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>{order.paymentStatus.replaceAll("_", " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fulfillment</span>
                <span>{order.fulfillmentStatus.replaceAll("_", " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span>{Number(order.total).toFixed(2)} BHD</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}