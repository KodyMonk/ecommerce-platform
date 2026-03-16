import { db } from "@ecommerce/db";
import type { ProductDTO, ProductVariantDTO } from "@ecommerce/types";

function decimalToNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    const maybeDecimal = value as { toNumber?: () => number };
    if (typeof maybeDecimal.toNumber === "function") {
      return maybeDecimal.toNumber();
    }
  }
  return Number(value);
}

function mapVariant(variant: {
  id: string;
  title: string;
  sku: string | null;
  price: unknown;
  compareAtPrice: unknown;
  stock: number;
  imageUrl: string | null;
  isDefault: boolean;
  isActive: boolean;
  values: {
    optionValue: {
      value: string;
      option: {
        name: string;
      };
    };
  }[];
}): ProductVariantDTO {
  return {
    id: variant.id,
    title: variant.title,
    sku: variant.sku,
    price: decimalToNumber(variant.price),
    compareAtPrice: decimalToNumber(variant.compareAtPrice),
    stock: variant.stock,
    imageUrl: variant.imageUrl,
    isDefault: variant.isDefault,
    isActive: variant.isActive,
    values: variant.values.map((entry) => ({
      optionName: entry.optionValue.option.name,
      value: entry.optionValue.value,
    })),
  };
}

export async function getProducts(): Promise<ProductDTO[]> {
  const products = await db.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      variants: {
        where: {
          isActive: true,
        },
        orderBy: [
          { isDefault: "desc" },
          { createdAt: "asc" },
        ],
        include: {
          values: {
            include: {
              optionValue: {
                include: {
                  option: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    sku: product.sku,
    basePrice: decimalToNumber(product.basePrice) ?? 0,
    compareAtPrice: decimalToNumber(product.compareAtPrice),
    currency: product.currency,
    stock: product.stock,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    brand: product.brand
      ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
        }
      : null,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
    })),
    variants: product.variants.map(mapVariant),
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const product = await db.product.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      variants: {
        where: {
          isActive: true,
        },
        orderBy: [
          { isDefault: "desc" },
          { createdAt: "asc" },
        ],
        include: {
          values: {
            include: {
              optionValue: {
                include: {
                  option: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    sku: product.sku,
    basePrice: decimalToNumber(product.basePrice) ?? 0,
    compareAtPrice: decimalToNumber(product.compareAtPrice),
    currency: product.currency,
    stock: product.stock,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    brand: product.brand
      ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
        }
      : null,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
    })),
    variants: product.variants.map(mapVariant),
  };
}