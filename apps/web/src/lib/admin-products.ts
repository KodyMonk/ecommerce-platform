import { db } from "@ecommerce/db";

type AdminProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "all" | "active" | "inactive" | "featured";
};

export async function getAdminProducts(params: AdminProductsParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, params.pageSize ?? 10));
  const skip = (page - 1) * pageSize;

  const search = (params.search || "").trim();
  const status = params.status ?? "all";

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status === "active"
      ? { isActive: true }
      : status === "inactive"
        ? { isActive: false }
        : status === "featured"
          ? { isFeatured: true }
          : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
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
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    search,
    status,
  };
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
      options: {
        include: {
          values: true,
        },
      },
    },
  });
}

export async function getAdminBrands() {
  return db.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getAdminCategories() {
  return db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

type ProductInput = {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  basePrice: number;
  stock: number;
  brandId?: string | null;
  categoryId?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  imageUrls?: string[];
};

function normalizeImageUrls(imageUrls?: string[]) {
  return (imageUrls || []).map((url) => url.trim()).filter(Boolean);
}

export async function createAdminProduct(data: ProductInput) {
  const imageUrls = normalizeImageUrls(data.imageUrls);

  return db.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      basePrice: data.basePrice,
      stock: data.stock,
      currency: "BHD",
      brandId: data.brandId || null,
      categoryId: data.categoryId || null,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      images:
        imageUrls.length > 0
          ? {
              create: imageUrls.map((url, index) => ({
                url,
                isPrimary: index === 0,
                sortOrder: index,
              })),
            }
          : undefined,
    },
    include: {
      images: true,
    },
  });
}

export async function updateAdminProduct(id: string, data: ProductInput) {
  const imageUrls = normalizeImageUrls(data.imageUrls);

  return db.$transaction(async (tx: any) => {
    const product = await tx.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription || null,
        description: data.description || null,
        basePrice: data.basePrice,
        stock: data.stock,
        brandId: data.brandId || null,
        categoryId: data.categoryId || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
    });

    await tx.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    if (imageUrls.length > 0) {
      await tx.productImage.createMany({
        data: imageUrls.map((url, index) => ({
          productId: id,
          url,
          isPrimary: index === 0,
          sortOrder: index,
        })),
      });
    }

    return product;
  });
}

export async function deleteAdminProduct(id: string) {
  return db.product.delete({
    where: {
      id,
    },
  });
}

export async function toggleAdminProductFeatured(id: string, isFeatured: boolean) {
  return db.product.update({
    where: { id },
    data: { isFeatured },
  });
}

export async function toggleAdminProductActive(id: string, isActive: boolean) {
  return db.product.update({
    where: { id },
    data: { isActive },
  });
}