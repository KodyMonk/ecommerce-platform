import { NextResponse } from "next/server";
import { toggleWishlistProduct } from "@/lib/wishlist";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = String(body.productId || "");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "productId is required" },
        { status: 400 }
      );
    }

    const result = await toggleWishlistProduct(productId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/wishlist/toggle error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update wishlist",
      },
      { status: 500 }
    );
  }
}