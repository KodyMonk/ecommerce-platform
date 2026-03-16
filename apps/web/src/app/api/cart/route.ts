import { NextResponse } from "next/server";
import { addToCart, getCart } from "@/lib/cart";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cart = await getCart();

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, variantId, quantity } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, error: "productId and quantity are required" },
        { status: 400 }
      );
    }

    await addToCart({
      productId,
      variantId: variantId ?? null,
      quantity: Number(quantity),
    });

    const cart = await getCart();

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}