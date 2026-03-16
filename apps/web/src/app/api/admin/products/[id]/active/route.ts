import { NextResponse } from "next/server";
import { toggleAdminProductActive } from "../../../../../../lib/admin-products";

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

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    const product = await toggleAdminProductActive(id, body.isActive);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id]/active error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update active status" },
      { status: 500 }
    );
  }
}