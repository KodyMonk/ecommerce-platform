import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminProductsTable from "@/components/admin/admin-products-table";
import { getAdminProducts } from "@/lib/admin-products";

type SearchParams = Promise<{
  page?: string;
  sortBy?: string;
  sortOrder?: string;
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
  const sortBy =
    params.sortBy === "name" ||
    params.sortBy === "basePrice" ||
    params.sortBy === "stock" ||
    params.sortBy === "createdAt"
      ? params.sortBy
      : "createdAt";

  const sortOrder =
    params.sortOrder === "asc" || params.sortOrder === "desc"
      ? params.sortOrder
      : "desc";

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
    sortBy,
    sortOrder,
    status,
  });

  function buildPageLink(nextPage: number) {
    const qs = new URLSearchParams();
    qs.set("page", String(nextPage));
    qs.set("sortBy", sortBy);
    qs.set("sortOrder", sortOrder);
    qs.set("status", status);
    return `/admin/products?${qs.toString()}`;
  }

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Products</h1>
        </div>

        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="mb-6 rounded-2xl border p-4">
        <form className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Sort by</label>
            <select
              name="sortBy"
              defaultValue={sortBy}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
              <option value="basePrice">Price</option>
              <option value="stock">Stock</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Order</label>
            <select
              name="sortOrder"
              defaultValue={sortOrder}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Filter</label>
            <select
              name="status"
              defaultValue={status}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Apply
            </Button>
          </div>
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
          <Link
            href={buildPageLink(Math.max(1, result.page - 1))}
            aria-disabled={result.page <= 1}
          >
            <Button variant="outline" disabled={result.page <= 1}>
              Previous
            </Button>
          </Link>

          <Link
            href={buildPageLink(Math.min(result.totalPages, result.page + 1))}
            aria-disabled={result.page >= result.totalPages}
          >
            <Button variant="outline" disabled={result.page >= result.totalPages}>
              Next
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}