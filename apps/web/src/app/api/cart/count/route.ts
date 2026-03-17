import { NextResponse } from "next/server";
import { getCart } from "@/lib/cart";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cart = await getCart();

    const count =
      cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        count,
      },
    });
  } catch (error) {
    console.error("GET /api/cart/count error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to load cart count" },
      { status: 500 }
    );
  }
}