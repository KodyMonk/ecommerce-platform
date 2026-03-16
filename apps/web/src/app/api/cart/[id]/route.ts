import { NextResponse } from "next/server";
import { getCart, removeCartItem } from "@/lib/cart";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await removeCartItem(id);
    const cart = await getCart();

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("DELETE /api/cart/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}