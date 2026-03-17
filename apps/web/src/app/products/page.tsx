import Link from "next/link";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import ProductCard from "@/components/storefront/product-card";
import { getProducts } from "@/lib/products";

type SearchParams = Promise<{
  category?: string;
  search?: string;
  sort?: string;
}>;

export const metadata = {
  title: "Shop",
  description: "Browse products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const products = await getProducts();

  const search = (params.search || "").trim().toLowerCase();
  const category = (params.category || "").trim().toLowerCase();
  const sort = (params.sort || "featured").trim();

  const categories = Array.from(
    new Map(
      products
        .filter((product) => product.category)
        .map((product) => [
          product.category!.slug,
          {
            slug: product.category!.slug,
            name: product.category!.name,
          },
        ])
    ).values()
  );

  let filtered = products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.brand?.name.toLowerCase().includes(search) ||
      product.category?.name.toLowerCase().includes(search) ||
      product.shortDescription?.toLowerCase().includes(search);

    const matchesCategory =
      !category || product.category?.slug.toLowerCase() === category;

    return matchesSearch && matchesCategory;
  });

  filtered = filtered.sort((a, b) => {
    const aPrice =
      a.variants.find((v) => v.isDefault)?.price ??
      a.variants[0]?.price ??
      a.basePrice;
    const bPrice =
      b.variants.find((v) => v.isDefault)?.price ??
      b.variants[0]?.price ??
      b.basePrice;

    if (sort === "price-asc") return Number(aPrice) - Number(bPrice);
    if (sort === "price-desc") return Number(bPrice) - Number(aPrice);
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    return Number(b.isFeatured) - Number(a.isFeatured);
  });

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products" },
          ]}
        />

        <section className="mt-6 border border-neutral-200 bg-[#f7f3ec] px-6 py-10 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-neutral-600">
              Curated Storefront
            </p>
            <h1 className="mt-3 text-4xl font-semibold uppercase tracking-[0.08em] md:text-5xl">
              Shop The Collection
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">
              Browse a polished selection of lifestyle, beauty, home and gifting essentials.
            </p>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-6 border border-neutral-200 p-5">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">
                Filters
              </h2>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  Search
                </label>
                <input
                  name="search"
                  defaultValue={params.search || ""}
                  placeholder="Search products"
                  className="h-11 w-full border border-neutral-300 px-3 text-sm outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={params.category || ""}
                  className="h-11 w-full border border-neutral-300 px-3 text-sm outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  Sort By
                </label>
                <select
                  name="sort"
                  defaultValue={params.sort || "featured"}
                  className="h-11 w-full border border-neutral-300 px-3 text-sm outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              <button
                type="submit"
                className="h-11 w-full bg-black text-sm font-medium uppercase tracking-[0.12em] text-white"
              >
                Apply Filters
              </button>

              <Link
                href="/products"
                className="block text-center text-sm text-neutral-500 underline underline-offset-4"
              >
                Clear Filters
              </Link>
            </form>
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-3 border-b border-neutral-200 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold uppercase tracking-[0.1em]">
                  {category
                    ? categories.find((item) => item.slug === category)?.name || "Products"
                    : "All Products"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {filtered.length} product{filtered.length === 1 ? "" : "s"} found
                </p>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="border border-neutral-200 px-6 py-12 text-center text-neutral-500">
                No products matched your filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}