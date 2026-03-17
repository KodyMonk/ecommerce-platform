import { NextResponse } from "next/server";
import { createReview } from "@/lib/reviews";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productId = String(body.productId || "");
    const rating = Number(body.rating || 0);
    const title = String(body.title || "");
    const comment = String(body.comment || "");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "productId is required" },
        { status: 400 }
      );
    }

    const review = await createReview({
      productId,
      rating,
      title,
      comment,
    });

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create review",
      },
      { status: 500 }
    );
  }
}