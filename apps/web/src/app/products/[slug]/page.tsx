import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/product/product-gallery";
import ProductPurchasePanel from "@/components/product/product-purchase-panel";
import { getProductBySlug } from "@/lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  const image = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  return {
    title: `${product.name} | ${product.brand?.name ?? "Store"}`,
    description: product.shortDescription || product.description || `Buy ${product.name} online`,
    openGraph: {
      title: product.name,
      description:
        product.shortDescription || product.description || `Buy ${product.name} online`,
      images: image ? [{ url: image }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="container mx-auto px-6 py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} />
      </div>
    </main>
  );
}