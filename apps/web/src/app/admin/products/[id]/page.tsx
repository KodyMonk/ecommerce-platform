import ProductEditorShell from "@/components/admin/product-editor-shell";
import {
  getAdminBrands,
  getAdminCategories,
  getAdminProduct,
} from "../../../../lib/admin-products";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, brands, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminBrands(),
    getAdminCategories(),
  ]);

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Edit Product</h1>

      <ProductEditorShell
        product={{
          ...product,
          basePrice: Number(product.basePrice),
          variants: product.variants.map((variant) => ({
            ...variant,
            price:
              variant.price === null || variant.price === undefined
                ? null
                : Number(variant.price),
          })),
        }}
        brands={brands}
        categories={categories}
      />
    </main>
  );
}