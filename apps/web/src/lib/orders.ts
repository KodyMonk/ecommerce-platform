import { db } from "@ecommerce/db";
import { getCart, getCurrentCartUser } from "@/lib/cart";
import { getSavedAddressById } from "@/lib/addresses";

type CheckoutInput = {
  fullName: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  notes?: string;
  paymentMethod: "COD" | "MANUAL";
  savedAddressId?: string;
  saveAddress?: boolean;
};

export type OrderWithRelations = Awaited<ReturnType<typeof getOrderByNumber>> extends infer T
  ? Exclude<T, undefined>
  : never;

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${y}-${rand}`;
}

export async function createOrderFromCart(input: CheckoutInput) {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const user = await getCurrentCartUser();

  const subtotal = cart.items.reduce((sum: number, item) => {
    const unitPrice = Number(item.variant?.price ?? item.product.basePrice);
    return sum + unitPrice * item.quantity;
  }, 0);

  const discountTotal = 0;
  const shippingTotal = 0;
  const taxTotal = 0;
  const total = subtotal - discountTotal + shippingTotal + taxTotal;

  const orderNumber = generateOrderNumber();

  const result = await db.$transaction(async (tx: any) => {
    let shippingAddressId: string | null = null;
    let billingAddressId: string | null = null;

    if (input.savedAddressId) {
      const savedAddress = await getSavedAddressById(input.savedAddressId);

      if (!savedAddress) {
        throw new Error("Saved address not found");
      }

      shippingAddressId = savedAddress.id;
      billingAddressId = savedAddress.id;
    } else {
      const address = await tx.address.create({
        data: {
          userId: user.id,
          type: "SHIPPING",
          fullName: input.fullName,
          phone: input.phone || null,
          line1: input.line1,
          line2: input.line2 || null,
          city: input.city,
          state: input.state || null,
          postalCode: input.postalCode || null,
          country: input.country,
        },
      });

      shippingAddressId = address.id;
      billingAddressId = address.id;
    }

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        fulfillmentStatus: "UNFULFILLED",
        paymentMethod: input.paymentMethod,
        subtotal,
        discountTotal,
        shippingTotal,
        taxTotal,
        total,
        currency: "BHD",
        notes: input.notes || null,
        shippingAddressId,
        billingAddressId,
      },
    });

    for (const item of cart.items) {
      const unitPrice = Number(item.variant?.price ?? item.product.basePrice);
      const compareAtPrice = item.variant?.compareAtPrice
        ? Number(item.variant.compareAtPrice)
        : item.product.compareAtPrice
          ? Number(item.product.compareAtPrice)
          : null;

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.product.name,
          productSlug: item.product.slug,
          variantTitle: item.variant?.title || null,
          sku: item.variant?.sku || item.product.sku || null,
          imageUrl:
            item.product.images.find((img: { isPrimary: boolean; url: string }) => img.isPrimary)
              ?.url ||
            item.product.images[0]?.url ||
            null,
          unitPrice,
          compareAtPrice,
          quantity: item.quantity,
          lineTotal: unitPrice * item.quantity,
          weight: item.variant?.weight ?? item.product.weight ?? null,
          weightUnit: item.variant?.weightUnit ?? item.product.weightUnit ?? null,
        },
      });

      if (item.variantId && item.variant?.trackInventory) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      } else if (item.product.trackInventory) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        fulfillmentStatus: "UNFULFILLED",
        note:
          input.paymentMethod === "COD"
            ? "Order placed with Cash on Delivery"
            : "Order placed with Manual Payment",
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });

  return result;
}

export async function getOrderByNumber(orderNumber: string) {
  return db.order.findUnique({
    where: { orderNumber },
    include: {
      shippingAddress: true,
      billingAddress: true,
      items: true,
      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function getOrdersForCurrentUser() {
  const user = await getCurrentCartUser();

  return db.order.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
      shippingAddress: true,
      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}