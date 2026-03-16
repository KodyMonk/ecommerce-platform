import { db } from "@ecommerce/db";

export async function getOrCreateGuestUser() {
  const email = "guest@demo.local";

  const existing = await db.user.findUnique({
    where: { email },
  });

  if (existing) return existing;

  return db.user.create({
    data: {
      email,
      name: "Guest User",
      role: "CUSTOMER",
    },
  });
}

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
      variant: {
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
} as const;

export async function getOrCreateCart() {
  const user = await getOrCreateGuestUser();

  const existingCart = await db.cart.findUnique({
    where: { userId: user.id },
    include: cartInclude,
  });

  if (existingCart) return existingCart;

  return db.cart.create({
    data: {
      userId: user.id,
    },
    include: cartInclude,
  });
}

export async function addToCart(input: {
  productId: string;
  variantId?: string | null;
  quantity: number;
}) {
  const cart = await getOrCreateCart();

  const existing = await db.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: input.productId,
      variantId: input.variantId ?? null,
    },
  });

  if (existing) {
    return db.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + input.quantity,
      },
    });
  }

  return db.cartItem.create({
    data: {
      cartId: cart.id,
      productId: input.productId,
      variantId: input.variantId ?? null,
      quantity: input.quantity,
    },
  });
}

export async function getCart() {
  const cart = await getOrCreateCart();

  return db.cart.findUnique({
    where: { id: cart.id },
    include: cartInclude,
  });
}

export async function removeCartItem(cartItemId: string) {
  return db.cartItem.delete({
    where: { id: cartItemId },
  });
}