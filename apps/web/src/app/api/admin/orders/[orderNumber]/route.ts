import { NextResponse } from "next/server";
import { updateAdminOrder } from "@/lib/admin-orders";

export const runtime = "nodejs";

type Props = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { orderNumber } = await params;
    const body = await req.json();

    const status = String(body.status || "");
    const paymentStatus = String(body.paymentStatus || "");
    const fulfillmentStatus = String(body.fulfillmentStatus || "");
    const note = String(body.note || "");

    const allowedStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];
    const allowedPaymentStatuses = ["PENDING", "PAID", "FAILED"];
    const allowedFulfillmentStatuses = [
      "UNFULFILLED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid order status" },
        { status: 400 }
      );
    }

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment status" },
        { status: 400 }
      );
    }

    if (!allowedFulfillmentStatuses.includes(fulfillmentStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid fulfillment status" },
        { status: 400 }
      );
    }

    const order = await updateAdminOrder({
      orderNumber,
      status: status as "PENDING" | "CONFIRMED" | "CANCELLED",
      paymentStatus: paymentStatus as "PENDING" | "PAID" | "FAILED",
      fulfillmentStatus: fulfillmentStatus as
        | "UNFULFILLED"
        | "SHIPPED"
        | "OUT_FOR_DELIVERY"
        | "DELIVERED",
      note,
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[orderNumber] error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update order",
      },
      { status: 500 }
    );
  }
}