import { NextResponse } from "next/server";
import { getWishlist } from "@/lib/wishlist";

export const runtime = "nodejs";

export async function GET() {
  try {
    const wishlist = await getWishlist();

    return NextResponse.json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error("GET /api/wishlist error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to load wishlist" },
      { status: 500 }
    );
  }
}