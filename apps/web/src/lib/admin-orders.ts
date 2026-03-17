import { db } from "@ecommerce/db";

export async function getAdminOrders() {
  return db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      shippingAddress: true,
      items: true,
    },
  });
}

export async function getAdminOrderByNumber(orderNumber: string) {
  return db.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      user: true,
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

export async function updateAdminOrder(input: {
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  fulfillmentStatus: "UNFULFILLED" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED";
  note?: string;
}) {
  const order = await db.order.findUnique({
    where: {
      orderNumber: input.orderNumber,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const updated = await db.$transaction(async (tx: any) => {
    const nextOrder = await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: input.status,
        paymentStatus: input.paymentStatus,
        fulfillmentStatus: input.fulfillmentStatus,
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: input.status,
        paymentStatus: input.paymentStatus,
        fulfillmentStatus: input.fulfillmentStatus,
        note: input.note || "Order updated by admin",
      },
    });

    return nextOrder;
  });

  return updated;
}