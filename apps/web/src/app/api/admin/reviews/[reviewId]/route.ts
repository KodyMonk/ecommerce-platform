import { NextResponse } from "next/server";
import { deleteReview, toggleReviewVisibility } from "@/lib/reviews";

export const runtime = "nodejs";

type Context = {
  params: Promise<{
    reviewId: string;
  }>;
};

export async function PATCH(_: Request, { params }: Context) {
  try {
    const { reviewId } = await params;

    const updated = await toggleReviewVisibility(reviewId);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH review error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update review",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    const { reviewId } = await params;

    await deleteReview(reviewId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE review error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete review",
      },
      { status: 500 }
    );
  }
}