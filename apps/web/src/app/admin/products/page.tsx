import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminProductsTable from "@/components/admin/admin-products-table";
import { getAdminProducts } from "@/lib/admin-products";

type SearchParams = Promise<{
  page?: string;
  search?: string;
  status?: string;
}>;

export const metadata = {
  title: "Admin Products",
  description: "Manage store products",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const page = Number(params.page || "1");
  const search = params.search || "";
  const status =
    params.status === "active" ||
    params.status === "inactive" ||
    params.status === "featured" ||
    params.status === "all"
      ? params.status
      : "all";

  const result = await getAdminProducts({
    page,
    pageSize: 10,
    search,
    status,
  });

  function buildPageLink(nextPage: number) {
    const qs = new URLSearchParams();
    qs.set("page", String(nextPage));
    qs.set("search", search);
    qs.set("status", status);
    return `/admin/products?${qs.toString()}`;
  }

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Products
          </h1>
        </div>

        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="mb-6 rounded-3xl border bg-card p-4 shadow-sm">
        <form className="grid gap-4 md:grid-cols-[1fr_220px_160px]">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search products..."
            className="h-11 rounded-md border bg-background px-3 text-sm"
          />

          <select
            name="status"
            defaultValue={status}
            className="h-11 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
          </select>

          <Button type="submit">Apply</Button>
        </form>
      </div>

      <AdminProductsTable
        products={result.products.map((product) => ({
          ...product,
          basePrice: Number(product.basePrice),
        }))}
      />

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {result.page} of {result.totalPages} · {result.total} product(s)
        </p>

        <div className="flex gap-2">
          <Link href={buildPageLink(Math.max(1, result.page - 1))}>
            <Button variant="outline" disabled={result.page <= 1}>
              Previous
            </Button>
          </Link>

          <Link href={buildPageLink(Math.min(result.totalPages, result.page + 1))}>
            <Button variant="outline" disabled={result.page >= result.totalPages}>
              Next
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}