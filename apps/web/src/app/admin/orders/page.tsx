import Link from "next/link";
import { getAdminOrders } from "@/lib/admin-orders";

export const metadata = {
  title: "Admin Orders",
  description: "Manage store orders",
};

function formatValue(value: string) {
  return value.replaceAll("_", " ");
}

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review and manage customer orders.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="grid grid-cols-[1.1fr_1fr_0.8fr_0.9fr_0.9fr_0.8fr] gap-4 border-b bg-muted/30 px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div>Order</div>
          <div>Customer</div>
          <div>Status</div>
          <div>Payment</div>
          <div>Fulfillment</div>
          <div className="text-right">Total</div>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-8 text-sm text-muted-foreground">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.orderNumber}`}
              className="grid grid-cols-[1.1fr_1fr_0.8fr_0.9fr_0.9fr_0.8fr] gap-4 border-b px-5 py-4 transition hover:bg-muted/20"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{order.orderNumber}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="min-w-0">
                <p className="truncate">
                  {order.shippingAddress?.fullName ||
                    order.user?.name ||
                    order.user?.email ||
                    "Guest"}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {order.user?.email || "No email"}
                </p>
              </div>

              <div className="text-sm">{formatValue(order.status)}</div>
              <div className="text-sm">{formatValue(order.paymentStatus)}</div>
              <div className="text-sm">
                {formatValue(order.fulfillmentStatus)}
              </div>

              <div className="text-right font-medium">
                {Number(order.total).toFixed(2)} {order.currency}
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}