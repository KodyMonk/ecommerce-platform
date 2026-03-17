import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import ProductGallery from "@/components/product/product-gallery";
import ProductPurchasePanel from "@/components/product/product-purchase-panel";
import ProductCard from "@/components/storefront/product-card";
import Breadcrumbs from "@/components/layout/breadcrumbs";

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

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category?.slug === product.category?.slug ||
          item.brand?.slug === product.brand?.slug)
    )
    .slice(0, 4);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
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

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section>
            <ProductGallery
              images={product.images.map((image) => ({
                id: image.id,
                url: image.url,
                isPrimary: image.isPrimary,
                alt: product.name,
              }))}
              productName={product.name}
            />
          </section>

          <section>
            <ProductPurchasePanel product={product} />
          </section>
        </div>

        <div className="mt-12 grid gap-8 border-y border-neutral-200 py-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-900">
              Authentic Selection
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Carefully merchandised products with multi-image presentation and polished details.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-900">
              Delivery & Support
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Easy checkout, saved addresses, wishlist support and order tracking built in.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-900">
              Customer Feedback
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Reviews will be added back after we isolate the slow component safely.
            </p>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-16">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
                More to Explore
              </p>
              <h2 className="mt-3 text-3xl font-semibold uppercase tracking-[0.08em]">
                Related Products
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}