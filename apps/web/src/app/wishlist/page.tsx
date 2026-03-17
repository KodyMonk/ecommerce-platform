import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import WishlistButton from "@/components/product/wishlist-button";
import { getWishlist } from "@/lib/wishlist";

export const metadata = {
  title: "Wishlist",
  description: "Saved products",
};

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/wishlist");
  }

  const wishlist = await getWishlist();
  const items = wishlist?.items || [];

  return (
    <main className="container mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Wishlist" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Wishlist</h1>
        <p className="mt-2 text-muted-foreground">
          Your saved products.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border p-8">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Link href="/products">
            <Button className="mt-4">Browse products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const product = item.product;
            const image =
              product.images.find((img) => img.isPrimary)?.url ||
              product.images[0]?.url ||
              "/placeholder.jpg";

            return (
              <div key={item.id} className="rounded-2xl border p-4">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>

                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{product.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {Number(product.basePrice).toFixed(2)} {product.currency}
                    </p>
                  </div>

                  <WishlistButton
                    productId={product.id}
                    initiallySaved={true}
                  />
                </div>

                <div className="flex gap-3">
                  <Link href={`/products/${product.slug}`} className="flex-1">
                    <Button className="w-full">View Product</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}