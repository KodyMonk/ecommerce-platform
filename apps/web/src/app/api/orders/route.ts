import { NextResponse } from "next/server";
import { createOrderFromCart } from "../../../lib/orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ["fullName", "line1", "city", "country"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const order = await createOrderFromCart({
      fullName: body.fullName,
      email: body.email || "guest@demo.local",
      phone: body.phone || "",
      line1: body.line1,
      line2: body.line2 || "",
      city: body.city,
      state: body.state || "",
      postalCode: body.postalCode || "",
      country: body.country,
      notes: body.notes || "",
    });

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}