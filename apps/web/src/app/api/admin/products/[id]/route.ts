import { NextResponse } from "next/server";
import { db } from "@ecommerce/db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}