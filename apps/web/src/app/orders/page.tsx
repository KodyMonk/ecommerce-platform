import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import { getOrdersForCurrentUser } from "@/lib/orders";

export const metadata = {
  title: "My Orders",
  description: "View your order history and track current orders",
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default async function OrdersPage() {
  const orders = await getOrdersForCurrentUser();

  return (
    <main className="container mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Orders" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-semibold">My Orders</h1>
        <p className="mt-2 text-muted-foreground">
          Track your orders and view your order history.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border p-8">
          <p className="text-muted-foreground">You have no orders yet.</p>
          <Link href="/products">
            <Button className="mt-4">Start shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold">{order.orderNumber}</p>
                    <Badge variant="secondary">
                      {formatStatus(order.status)}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item(s)
                  </p>

                  {order.shippingCarrier ? (
                    <p className="text-sm text-muted-foreground">
                      Carrier: {order.shippingCarrier}
                    </p>
                  ) : null}

                  {order.trackingNumber ? (
                    <p className="text-sm text-muted-foreground">
                      Tracking: {order.trackingNumber}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <p className="text-lg font-semibold">
                    {Number(order.total).toFixed(2)} BHD
                  </p>

                  <Link href={`/orders/${order.orderNumber}`}>
                    <Button variant="outline">View Order</Button>
                  </Link>
                </div>
              </div>

              {order.items.length > 0 ? (
                <div className="mt-5 border-t pt-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <div>
                          <span className="font-medium">{item.productName}</span>
                          {item.variantTitle ? (
                            <span className="text-muted-foreground">
                              {" "}
                              · {item.variantTitle}
                            </span>
                          ) : null}
                        </div>

                        <div className="text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    ))}

                    {order.items.length > 3 ? (
                      <p className="text-sm text-muted-foreground">
                        + {order.items.length - 3} more item(s)
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}