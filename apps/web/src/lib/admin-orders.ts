import { db } from "@ecommerce/db";

export async function getAdminOrders() {
  return db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      items: true,
      shippingAddress: true,
    },
  });
}

export async function getAdminOrderByNumber(orderNumber: string) {
  return db.order.findUnique({
    where: { orderNumber },
    include: {
      user: true,
      items: true,
      shippingAddress: true,
      billingAddress: true,
      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

type UpdateOrderStatusInput = {
  orderNumber: string;
  status: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  trackingNumber?: string;
  shippingCarrier?: string;
  note?: string;
};

export async function updateAdminOrderStatus(input: UpdateOrderStatusInput) {
  const order = await db.order.findUnique({
    where: { orderNumber: input.orderNumber },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const now = new Date();

  const updateData: Record<string, unknown> = {
    status: input.status,
    paymentStatus: input.paymentStatus || order.paymentStatus,
    fulfillmentStatus: input.fulfillmentStatus || order.fulfillmentStatus,
    trackingNumber: input.trackingNumber || null,
    shippingCarrier: input.shippingCarrier || null,
  };

  if (input.status === "SHIPPED") {
    updateData.shippedAt = now;
  }

  if (input.status === "OUT_FOR_DELIVERY") {
    updateData.outForDeliveryAt = now;
  }

  if (input.status === "DELIVERED") {
    updateData.deliveredAt = now;
  }

  if (input.status === "CANCELLED") {
    updateData.cancelledAt = now;
  }

  return db.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { orderNumber: input.orderNumber },
      data: updateData,
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: updated.id,
        status: input.status as never,
        paymentStatus: (input.paymentStatus || updated.paymentStatus) as never,
        fulfillmentStatus: (input.fulfillmentStatus ||
          updated.fulfillmentStatus) as never,
        trackingNumber: input.trackingNumber || null,
        shippingCarrier: input.shippingCarrier || null,
        note: input.note || null,
      },
    });

    return updated;
  });
}