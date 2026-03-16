import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductDTO } from "@ecommerce/types";

type Props = {
  product: ProductDTO;
};

export default function ProductCard({ product }: Props) {
  const image =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "/placeholder.jpg";

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="overflow-hidden border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-muted">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {product.brand && (
            <p className="text-sm text-muted-foreground">{product.brand.name}</p>
          )}

          <h3 className="line-clamp-2 font-medium">{product.name}</h3>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="font-semibold">
                {product.basePrice} {product.currency}
              </p>
              {product.compareAtPrice && product.compareAtPrice > product.basePrice ? (
                <p className="text-sm text-muted-foreground line-through">
                  {product.compareAtPrice} {product.currency}
                </p>
              ) : null}
            </div>

            {product.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}