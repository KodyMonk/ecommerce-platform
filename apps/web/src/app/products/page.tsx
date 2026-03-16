import ProductGrid from "@/components/product/product-grid"
import { getProducts } from "@/lib/products"

export const metadata = {
  title: "Products",
  description: "Browse our latest products"
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="container mx-auto px-6 py-12">

      <h1 className="text-3xl font-semibold mb-8">
        Products
      </h1>

      <ProductGrid products={products} />

    </main>
  )
}