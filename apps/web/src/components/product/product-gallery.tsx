"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ProductDTO } from "@ecommerce/types";
import { cn } from "@/lib/utils";

type Props = {
  product: ProductDTO;
};

export default function ProductGallery({ product }: Props) {
  const images = useMemo(() => {
    if (product.images.length > 0) return product.images;
    return [
      {
        id: "fallback",
        url: "/placeholder.jpg",
        alt: product.name,
        sortOrder: 0,
        isPrimary: true,
      },
    ];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted",
              selectedImage.id === image.id && "ring-2 ring-foreground/20"
            )}
          >
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
          <Image
            src={selectedImage.url}
            alt={selectedImage.alt || product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}