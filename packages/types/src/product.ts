export type ProductImageDTO = {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ProductVariantValueDTO = {
  optionName: string;
  value: string;
};

export type ProductVariantDTO = {
  id: string;
  title: string;
  sku?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  stock: number;
  imageUrl?: string | null;
  isDefault: boolean;
  isActive: boolean;
  values: ProductVariantValueDTO[];
};

export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  sku?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  currency: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
};