import { auth } from "@/auth";
import { db } from "@ecommerce/db";

async function getCurrentWishlistUser() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  return db.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
}

export async function getOrCreateWishlist() {
  const user = await getCurrentWishlistUser();

  if (!user) return null;

  const existing = await db.wishlist.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      items: {
        include: {
          product: {
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
                orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
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
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (existing) return existing;

  return db.wishlist.create({
    data: {
      userId: user.id,
    },
    include: {
      items: {
        include: {
          product: {
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
                orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
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
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getWishlist() {
  return getOrCreateWishlist();
}

export async function getWishlistProductIds() {
  const wishlist = await getOrCreateWishlist();
  if (!wishlist) return [];

  return wishlist.items.map((item) => item.productId);
}

export async function isProductInWishlist(productId: string) {
  const wishlist = await getOrCreateWishlist();
  if (!wishlist) return false;

  return wishlist.items.some((item) => item.productId === productId);
}

export async function toggleWishlistProduct(productId: string) {
  const wishlist = await getOrCreateWishlist();
  if (!wishlist) {
    throw new Error("You must be logged in to use wishlist");
  }

  const existing = await db.wishlistItem.findUnique({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
  });

  if (existing) {
    await db.wishlistItem.delete({
      where: {
        id: existing.id,
      },
    });

    return { added: false };
  }

  await db.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  return { added: true };
}