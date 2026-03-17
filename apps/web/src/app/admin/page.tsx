import Link from "next/link";
import {
  ArrowUpRight,
  Package,
  ShoppingBag,
  Star,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminProducts } from "@/lib/admin-products";
import { getAdminOrders } from "@/lib/admin-orders";

export const metadata = {
  title: "Admin Dashboard",
  description: "Store admin overview",
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default async function AdminDashboardPage() {
  const [productsResult, orders] = await Promise.all([
    getAdminProducts({ page: 1, pageSize: 8 }),
    getAdminOrders(),
  ]);

  const products = productsResult.products;
  const totalProducts = productsResult.total;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const featuredProducts = products.filter((product) => product.isFeatured).length;

  const lowStockProducts = products.filter((product) => {
    const stock =
      product.variants.length > 0
        ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
        : product.stock;

    return stock > 0 && stock <= 5;
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Monitor orders, products, stock levels, and overall store activity from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline">Manage Orders</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Revenue</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight">
            {totalRevenue.toFixed(2)} BHD
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Total recorded order value
          </p>
        </section>

        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Orders</span>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight">{totalOrders}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {pendingOrders} pending right now
          </p>
        </section>

        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Products</span>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight">{totalProducts}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {featuredProducts} featured products
          </p>
        </section>

        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Low Stock</span>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight">
            {lowStockProducts.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Products needing attention
          </p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Recent Orders</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest activity from your store
              </p>
            </div>

            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border">
            <div className="grid grid-cols-[1.1fr_0.9fr_0.7fr] gap-4 border-b bg-muted/30 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <div>Order</div>
              <div>Customer</div>
              <div className="text-right">Total</div>
            </div>

            {orders.slice(0, 6).length === 0 ? (
              <div className="px-4 py-8 text-sm text-muted-foreground">
                No orders yet.
              </div>
            ) : (
              orders.slice(0, 6).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.orderNumber}`}
                  className="grid grid-cols-[1.1fr_0.9fr_0.7fr] gap-4 border-b px-4 py-4 transition hover:bg-muted/20"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatStatus(order.status)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      {order.shippingAddress?.fullName ||
                        order.user?.email ||
                        "Guest"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <Clock3 className="mr-1 inline h-3.5 w-3.5" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      {Number(order.total).toFixed(2)} BHD
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Low Stock</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Products close to selling out
                </p>
              </div>

              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  Products
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No low stock products right now.
                </p>
              ) : (
                lowStockProducts.slice(0, 5).map((product) => {
                  const stock =
                    product.variants.length > 0
                      ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
                      : product.stock;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-2xl border px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>

                      <div className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                        {stock} left
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Store Snapshot</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quick overview of current catalog state
                </p>
              </div>

              <Star className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Featured Products</p>
                <p className="mt-2 text-2xl font-semibold">{featuredProducts}</p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="mt-2 text-2xl font-semibold">
                  {products.filter((product) => product.isActive).length}
                </p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="mt-2 text-2xl font-semibold">{pendingOrders}</p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Catalog Page</p>
                <div className="mt-3">
                  <Link href="/admin/products">
                    <Button variant="outline" size="sm">
                      Open Products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}