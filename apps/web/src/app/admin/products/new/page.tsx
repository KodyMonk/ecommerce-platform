import ProductForm from "@/components/admin/product-form";
import {
  getAdminBrands,
  getAdminCategories,
} from "@/lib/admin-products";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    getAdminBrands(),
    getAdminCategories(),
  ]);

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Create Product</h1>
      <ProductForm brands={brands} categories={categories} />
    </main>
  );
}