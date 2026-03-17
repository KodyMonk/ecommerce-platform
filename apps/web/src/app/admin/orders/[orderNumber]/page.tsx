import { notFound } from "next/navigation";
import OrderStatusForm from "@/components/admin/order-status-form";
import { getAdminOrderByNumber } from "@/lib/admin-orders";

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

function formatValue(value: string) {
  return value.replaceAll("_", " ");
}

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

  if (!order) {
    notFound();
  }

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Order Detail
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {order.orderNumber}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage status, payment, fulfillment, and review customer details.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Customer</h2>

            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">
                  {order.shippingAddress?.fullName ||
                    order.user?.name ||
                    "Guest"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{order.user?.email || "No email"}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium">{formatValue(order.paymentMethod)}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Placed At</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Items</h2>

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
                    {item.sku ? (
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                    ) : null}
                  </div>

                  <p className="font-medium">
                    {Number(item.lineTotal).toFixed(2)} {order.currency}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Status Timeline</h2>

            <div className="space-y-4">
              {order.statusHistory.map((entry) => (
                <div key={entry.id} className="border-l pl-4">
                  <p className="font-medium">{formatValue(entry.status)}</p>

                  <p className="text-sm text-muted-foreground">
                    Payment: {formatValue(entry.paymentStatus)}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Fulfillment: {formatValue(entry.fulfillmentStatus)}
                  </p>

                  {entry.note ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.note}
                    </p>
                  ) : null}

                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Update Order</h2>

            <OrderStatusForm
              orderNumber={order.orderNumber}
              initialStatus={order.status}
              initialPaymentStatus={order.paymentStatus}
              initialFulfillmentStatus={order.fulfillmentStatus}
            />
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order Status</span>
                <span>{formatValue(order.status)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <span>{formatValue(order.paymentStatus)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fulfillment</span>
                <span>{formatValue(order.fulfillmentStatus)}</span>
              </div>
            </div>

            <div className="my-5 border-t" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {Number(order.subtotal).toFixed(2)} {order.currency}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {Number(order.shippingTotal).toFixed(2)} {order.currency}
                </span>
              </div>

              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>
                  {Number(order.total).toFixed(2)} {order.currency}
                </span>
              </div>
            </div>
          </div>

          {order.shippingAddress ? (
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{order.shippingAddress.fullName}</p>
                {order.shippingAddress.phone ? (
                  <p>{order.shippingAddress.phone}</p>
                ) : null}
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 ? (
                  <p>{order.shippingAddress.line2}</p>
                ) : null}
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state
                    ? `, ${order.shippingAddress.state}`
                    : ""}
                </p>
                <p>
                  {order.shippingAddress.postalCode
                    ? `${order.shippingAddress.postalCode}, `
                    : ""}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}