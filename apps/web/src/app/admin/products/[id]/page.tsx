import { getAdminProduct } from "@/lib/admin-products";
import ProductForm from "../../../../components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getAdminProduct(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Edit Product</h1>

      <ProductForm product={product} />
    </main>
  );
}