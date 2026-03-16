import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}