import ProductGrid from "@/components/product/product-grid";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Products",
  description: "Browse our latest products",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products" },
        ]}
      />

      <h1 className="mb-8 text-3xl font-semibold">Products</h1>

      <ProductGrid products={products} />
    </main>
  );
}