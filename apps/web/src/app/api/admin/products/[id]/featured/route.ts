import { NextResponse } from "next/server";
import { toggleAdminProductFeatured } from "../../../../../../lib/admin-products";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (typeof body.isFeatured !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isFeatured must be a boolean" },
        { status: 400 }
      );
    }

    const product = await toggleAdminProductFeatured(id, body.isFeatured);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id]/featured error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update featured status" },
      { status: 500 }
    );
  }
}