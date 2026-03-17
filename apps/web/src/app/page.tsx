import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/storefront/product-card";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();

  const featuredProducts =
    products.filter((product) => product.isFeatured).slice(0, 5) ||
    products.slice(0, 5);

  const categoryBuckets = Array.from(
    new Map(
      products
        .filter((product) => product.category)
        .map((product) => [
          product.category!.slug,
          {
            name: product.category!.name,
            slug: product.category!.slug,
            image:
              product.images.find((img) => img.isPrimary)?.url ||
              product.images[0]?.url ||
              "/placeholder.jpg",
          },
        ])
    ).values()
  );

  const topCategories = categoryBuckets.slice(0, 4);
  const shoppingCircles = categoryBuckets.slice(0, 6);

  const brandBuckets = Array.from(
    new Map(
      products
        .filter((product) => product.brand)
        .map((product) => [
          product.brand!.slug,
          {
            name: product.brand!.name,
            slug: product.brand!.slug,
            image:
              product.images.find((img) => img.isPrimary)?.url ||
              product.images[0]?.url ||
              "/placeholder.jpg",
          },
        ])
    ).values()
  ).slice(0, 8);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-6">
        <section className="overflow-hidden border border-neutral-200 bg-[#f6ebe4]">
          <div className="grid min-h-[440px] items-center gap-8 px-8 py-10 md:grid-cols-2 md:px-14">
            <div className="relative h-[280px] md:h-[360px]">
              <div className="absolute inset-0 rounded-full bg-white/40 blur-3xl" />
              {featuredProducts[0] ? (
                <Image
                  src={
                    featuredProducts[0].images.find((img) => img.isPrimary)?.url ||
                    featuredProducts[0].images[0]?.url ||
                    "/placeholder.jpg"
                  }
                  alt={featuredProducts[0].name}
                  fill
                  className="object-contain"
                  sizes="50vw"
                  priority
                />
              ) : null}
            </div>

            <div className="max-w-xl justify-self-end text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8d160c]">
                Big Beauty Sale
              </p>
              <div className="mt-4 h-px w-full bg-neutral-800/40 md:max-w-[320px]" />
              <h1 className="mt-5 text-4xl font-semibold uppercase leading-tight text-[#8d160c] md:text-6xl">
                Up to 60% Off
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-neutral-700">
                Discover premium fragrances, lifestyle essentials and curated
                pieces with a clean luxury storefront experience.
              </p>
              <div className="mt-8">
                <Link href="/products">
                  <Button className="h-11 rounded-none bg-[#8d160c] px-8 text-white hover:bg-[#74130b]">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.12em]">
            What are you shopping for today?
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
            {shoppingCircles.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group text-center"
              >
                <div className="relative mx-auto aspect-square w-full max-w-[168px] overflow-hidden rounded-full border border-neutral-300 bg-[#f8f8f8]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="180px"
                  />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-800">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="overflow-hidden bg-[#173a6b]">
          <div className="grid items-center gap-6 px-8 py-8 md:grid-cols-[1fr_auto] md:px-12">
            <div className="text-white">
              <p className="text-sm uppercase tracking-[0.28em] text-white/80">
                Travel Edit
              </p>
              <h3 className="mt-3 text-3xl font-semibold uppercase md:text-5xl">
                Up to 40% Off
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">
                Explore elegant travel-ready picks, gifts and premium essentials
                curated for a polished destination lifestyle.
              </p>
            </div>

            <Link href="/products?search=travel">
              <Button className="rounded-none bg-black px-8 text-white hover:bg-neutral-800">
                Shop Now
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.12em]">
            Featured Products
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      <section className="bg-[#f3eedf] py-14">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.12em] md:text-left">
                Shop Our Brands
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                We carry local and international brands across lifestyle, beauty and home.
              </p>
            </div>

            <Link href="/products" className="text-sm font-medium underline underline-offset-4">
              View All
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brandBuckets.map((brand) => (
              <Link
                key={brand.slug}
                href={`/products?search=${encodeURIComponent(brand.name)}`}
                className="group overflow-hidden bg-white"
              >
                <div className="relative aspect-[1.2/0.8]">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-center text-3xl font-semibold uppercase tracking-[0.2em] text-white drop-shadow">
                      {brand.name}
                    </p>
                  </div>
                </div>
                <div className="py-4 text-center text-sm font-medium uppercase tracking-[0.12em]">
                  Shop Now
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 py-14">
        <section>
          <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.12em]">
            Our Top Categories
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {topCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-[1/1.1] overflow-hidden bg-[#f7f7f7]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="25vw"
                  />
                </div>
                <p className="pt-4 text-center text-xl font-medium uppercase tracking-[0.12em] text-neutral-800">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}