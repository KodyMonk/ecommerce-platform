import Link from "next/link";
import { getAdminOrders } from "@/lib/admin-orders";

export const metadata = {
  title: "Admin Orders",
  description: "Manage customer orders",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Orders</h1>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.orderNumber}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {order.shippingAddress?.fullName || order.user?.email || "Guest"}
                </td>
                <td className="px-4 py-3">{order.status.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">
                  {order.paymentStatus.replaceAll("_", " ")}
                </td>
                <td className="px-4 py-3">{Number(order.total).toFixed(2)} BHD</td>
                <td className="px-4 py-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}