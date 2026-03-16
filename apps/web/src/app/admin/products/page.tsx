import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminProductsTable from "@/components/admin/admin-products-table";

export const metadata = {
  title: "Admin Products",
  description: "Manage store products",
};

export default function AdminProductsPage() {
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

      <AdminProductsTable />
    </main>
  );
}