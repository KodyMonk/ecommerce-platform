import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import ProductPurchasePanel from "@/components/product/product-purchase-panel";
import ProductActions from "@/components/product/product-actions";
import ReviewsSection from "@/components/product/reviews-section";
import { getProductBySlug } from "@/lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription || product.description || product.name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images.find((image) => image.isPrimary)?.url ||
    product.images[0]?.url ||
    "/placeholder.jpg";

  return (
    <main className="container mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `/products?category=${product.category.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[120px_1fr]">
            <div className="order-2 flex gap-3 md:order-1 md:flex-col">
              {product.images.length > 0 ? (
                product.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square w-24 overflow-hidden rounded-2xl border bg-muted"
                  >
                    <Image
                      src={image.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ))
              ) : (
                <div className="relative aspect-square w-24 overflow-hidden rounded-2xl border bg-muted">
                  <Image
                    src="/placeholder.jpg"
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
            </div>

            <div className="order-1 relative aspect-square overflow-hidden rounded-3xl border bg-muted md:order-2">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </section>

        <section>
          <ProductPurchasePanel
            product={product}
            actions={<ProductActions productId={product.id} />}
          />
        </section>
      </div>

      <div className="mt-12">
        <ReviewsSection productId={product.id} />
      </div>
    </main>
  );
}