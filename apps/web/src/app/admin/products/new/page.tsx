import ProductForm from "@/components/admin/product-form";
import { getAdminBrands, getAdminCategories } from "@/lib/admin-products";

export const metadata = {
  title: "New Product",
  description: "Create a product",
};

export default async function AdminNewProductPage() {
  const [brands, categories] = await Promise.all([
    getAdminBrands(),
    getAdminCategories(),
  ]);

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Products
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Add Product
        </h1>
      </div>

      <ProductForm mode="create" brands={brands} categories={categories} />
    </main>
  );
}