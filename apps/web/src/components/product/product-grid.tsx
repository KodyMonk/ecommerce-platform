import ProductCard from "./product-card"
import type { ProductDTO } from "@ecommerce/types"

type Props = {
  products: ProductDTO[]
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}