import { db } from "@ecommerce/db";

export async function getAdminProducts() {
  return db.product.findMany({
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
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function getAdminProduct(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      variants: {
        orderBy: {
          createdAt: "asc",
        },
      },
      options: {
        include: {
          values: true,
        },
      },
    },
  });
}

export async function createAdminProduct(data: {
  name: string;
  slug: string;
  basePrice: number;
  description?: string;
}) {
  return db.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      basePrice: data.basePrice,
      description: data.description || null,
      currency: "BHD",
      isActive: true,
      isFeatured: false,
      trackInventory: true,
      stock: 0,
    },
  });
}

export async function updateAdminProduct(
  id: string,
  data: {
    name: string;
    slug: string;
    basePrice: number;
    description?: string;
  }
) {
  return db.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      basePrice: data.basePrice,
      description: data.description || null,
    },
  });
}

export async function toggleAdminProductFeatured(id: string, isFeatured: boolean) {
  return db.product.update({
    where: { id },
    data: {
      isFeatured,
    },
  });
}

export async function toggleAdminProductActive(id: string, isActive: boolean) {
  return db.product.update({
    where: { id },
    data: {
      isActive,
    },
  });
}