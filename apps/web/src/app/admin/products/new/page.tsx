import ProductForm from "../../../../components/admin/product-form";

export default function NewProductPage() {
  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Create Product</h1>

      <ProductForm />
    </main>
  );
}