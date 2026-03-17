import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@ecommerce/types";

type Props = {
  product: ProductDTO;
};

export default function ProductCard({ product }: Props) {
  const image =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "/placeholder.jpg";

  const price =
    product.variants.find((variant) => variant.isDefault)?.price ??
    product.variants[0]?.price ??
    product.basePrice;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden border border-neutral-200 bg-white transition hover:shadow-md">
        <div className="relative aspect-[4/4.4] overflow-hidden bg-[#fafafa]">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-contain p-5 transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
          />
        </div>

        <div className="space-y-1 px-3 pb-4 pt-3">
          {product.brand ? (
            <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
              {product.brand.name}
            </p>
          ) : null}

          <h3 className="line-clamp-2 text-[13px] font-medium uppercase leading-5 text-neutral-900">
            {product.name}
          </h3>

          <p className="pt-1 text-sm font-semibold text-neutral-900">
            BD {Number(price).toFixed(3)}
          </p>
        </div>
      </div>
    </Link>
  );
}