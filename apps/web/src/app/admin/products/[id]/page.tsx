import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/product-form";
import { getAdminBrands, getAdminCategories, getAdminProduct } from "@/lib/admin-products";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getAdminProduct(id);

  return {
    title: product ? `Edit ${product.name}` : "Edit Product",
  };
}

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getAdminProduct(id);

  if (!product) {
    notFound();
  }

  const [brands, categories] = await Promise.all([
    getAdminBrands(),
    getAdminCategories(),
  ]);

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "";

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Products
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Edit Product
        </h1>
      </div>

      <ProductForm
        mode="edit"
        productId={product.id}
        brands={brands}
        categories={categories}
        initialValues={{
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          description: product.description,
          basePrice: Number(product.basePrice),
          stock: product.stock,
          brandId: product.brandId,
          categoryId: product.categoryId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          imageUrl: primaryImage,
        }}
      />
    </main>
  );
}