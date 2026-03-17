import { db } from "@ecommerce/db";

type AdminProductsParams = {
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "name" | "basePrice" | "stock";
  sortOrder?: "asc" | "desc";
  status?: "all" | "active" | "inactive" | "featured";
};

export async function getAdminProducts(params: AdminProductsParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, params.pageSize ?? 10));
  const skip = (page - 1) * pageSize;

  const sortBy = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder ?? "desc";
  const status = params.status ?? "all";

  const where =
    status === "active"
      ? { isActive: true }
      : status === "inactive"
      ? { isActive: false }
      : status === "featured"
      ? { isFeatured: true }
      : {};

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
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

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    products,
    total,
    totalPages,
    page,
    pageSize,
    sortBy,
    sortOrder,
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
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getAdminCategories() {
  return db.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

type ProductInput = {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  stock: number;
  brandId?: string | null;
  categoryId?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl?: string | null;
};

export async function createAdminProduct(data: ProductInput) {
  return db.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      shortDescription: data.shortDescription || null,
      basePrice: data.basePrice,
      stock: data.stock,
      brandId: data.brandId || null,
      categoryId: data.categoryId || null,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      currency: "BHD",
      trackInventory: true,
      images: data.imageUrl
        ? {
            create: {
              url: data.imageUrl,
              alt: data.name,
              isPrimary: true,
              sortOrder: 0,
            },
          }
        : undefined,
    },
    include: {
      images: true,
    },
  });
}

export async function updateAdminProduct(id: string, data: ProductInput) {
  const existingImages = await db.productImage.findMany({
    where: {
      productId: id,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return db.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        shortDescription: data.shortDescription || null,
        basePrice: data.basePrice,
        stock: data.stock,
        brandId: data.brandId || null,
        categoryId: data.categoryId || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
    });

    if (data.imageUrl) {
      if (existingImages.length > 0) {
        await tx.productImage.update({
          where: {
            id: existingImages[0].id,
          },
          data: {
            url: data.imageUrl,
            alt: data.name,
            isPrimary: true,
            sortOrder: 0,
          },
        });
      } else {
        await tx.productImage.create({
          data: {
            productId: id,
            url: data.imageUrl,
            alt: data.name,
            isPrimary: true,
            sortOrder: 0,
          },
        });
      }
    }

    return product;
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

export async function createMultiOptionVariants(input: {
  productId: string;
  options: {
    name: string;
    values: string[];
  }[];
}) {
  const product = await db.product.findUnique({
    where: { id: input.productId },
    include: {
      options: {
        include: {
          values: true,
        },
      },
      variants: {
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

  if (!product) {
    throw new Error("Product not found");
  }

  const cleanedOptions = input.options
    .map((option) => ({
      name: option.name.trim(),
      values: option.values.map((v) => v.trim()).filter(Boolean),
    }))
    .filter((option) => option.name && option.values.length > 0);

  if (cleanedOptions.length === 0) {
    throw new Error("At least one option with values is required");
  }

  function cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce<string[][]>(
      (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
      [[]]
    );
  }

  return db.$transaction(async (tx) => {
    const optionMap: {
      optionId: string;
      optionName: string;
      values: { id: string; value: string }[];
    }[] = [];

    for (let optionIndex = 0; optionIndex < cleanedOptions.length; optionIndex++) {
      const inputOption = cleanedOptions[optionIndex];

      let existingOption = product.options.find(
        (o) => o.name.toLowerCase() === inputOption.name.toLowerCase()
      );

      if (!existingOption) {
        existingOption = await tx.productOption.create({
          data: {
            productId: product.id,
            name: inputOption.name,
            sortOrder: optionIndex,
          },
          include: {
            values: true,
          },
        });
      }

      const optionValues: { id: string; value: string }[] = [];

      for (let valueIndex = 0; valueIndex < inputOption.values.length; valueIndex++) {
        const inputValue = inputOption.values[valueIndex];

        let existingValue = existingOption.values.find(
          (v) => v.value.toLowerCase() === inputValue.toLowerCase()
        );

        if (!existingValue) {
          existingValue = await tx.productOptionValue.create({
            data: {
              optionId: existingOption.id,
              value: inputValue,
              sortOrder: valueIndex,
            },
          });
        }

        optionValues.push({
          id: existingValue.id,
          value: existingValue.value,
        });
      }

      optionMap.push({
        optionId: existingOption.id,
        optionName: existingOption.name,
        values: optionValues,
      });
    }

    const valueArrays = optionMap.map((option) => option.values.map((v) => v.value));
    const combinations = cartesianProduct(valueArrays);

    for (const combination of combinations) {
      const title = combination.join(" / ");

      const existingVariant = product.variants.find(
        (variant) => variant.title.toLowerCase() === title.toLowerCase()
      );

      if (existingVariant) continue;

      const createdVariant = await tx.productVariant.create({
        data: {
          productId: product.id,
          title,
          price: product.basePrice,
          stock: 0,
          isActive: true,
          trackInventory: true,
          isDefault: product.variants.length === 0,
        },
      });

      for (let i = 0; i < combination.length; i++) {
        const option = optionMap[i];
        const selectedValue = option.values.find(
          (v) => v.value.toLowerCase() === combination[i].toLowerCase()
        );

        if (!selectedValue) continue;

        await tx.productVariantValue.create({
          data: {
            variantId: createdVariant.id,
            optionValueId: selectedValue.id,
          },
        });
      }
    }

    return tx.product.findUnique({
      where: { id: product.id },
      include: {
        options: {
          include: {
            values: true,
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
      },
    });
  });
}