"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type ProductImage = {
  id: string;
  url: string;
  isPrimary: boolean;
  alt?: string;
};

type Props = {
  images: ProductImage[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const normalizedImages = useMemo(() => {
    if (images.length > 0) return images;

    return [
      {
        id: "placeholder",
        url: "/placeholder.jpg",
        isPrimary: true,
        alt: productName,
      },
    ];
  }, [images, productName]);

  const initialIndex = Math.max(
    0,
    normalizedImages.findIndex((image) => image.isPrimary)
  );

  const [activeIndex, setActiveIndex] = useState(
    initialIndex === -1 ? 0 : initialIndex
  );

  const activeImage = normalizedImages[activeIndex] || normalizedImages[0];

  return (
    <div className="grid gap-4 md:grid-cols-[110px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
        {normalizedImages.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square w-24 shrink-0 overflow-hidden border bg-[#fafafa] transition md:w-full ${
                isActive ? "border-black" : "border-neutral-200"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || productName}
                fill
                className="object-contain p-2"
                sizes="110px"
              />
            </button>
          );
        })}
      </div>

      <div className="order-1 relative aspect-[1/1.08] overflow-hidden border border-neutral-200 bg-[#fafafa] md:order-2">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || productName}
          fill
          className="object-contain p-6"
          sizes="(min-width: 1024px) 42vw, 100vw"
          priority
        />
      </div>
    </div>
  );
}