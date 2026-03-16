import { NextResponse } from "next/server";
import { updateAdminOrderStatus } from "../../../../../lib/admin-orders";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { orderNumber } = await context.params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json(
        { success: false, error: "status is required" },
        { status: 400 }
      );
    }

    const order = await updateAdminOrderStatus({
      orderNumber,
      status: body.status,
      paymentStatus: body.paymentStatus,
      fulfillmentStatus: body.fulfillmentStatus,
      trackingNumber: body.trackingNumber,
      shippingCarrier: body.shippingCarrier,
      note: body.note,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[orderNumber] error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}