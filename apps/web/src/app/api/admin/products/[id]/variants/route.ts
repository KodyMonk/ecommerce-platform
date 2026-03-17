import { NextResponse } from "next/server";
import { db } from "@ecommerce/db";

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

    if (!Array.isArray(body.variants)) {
      return NextResponse.json(
        { success: false, error: "variants must be an array" },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await db.$transaction(
      body.variants.map(
        (variant: {
          id: string;
          title?: string;
          stock?: number;
          price?: number | null;
          isActive?: boolean;
        }) =>
          db.productVariant.update({
            where: { id: variant.id },
            data: {
              title: variant.title,
              stock:
                typeof variant.stock === "number" ? variant.stock : undefined,
              price:
                typeof variant.price === "number"
                  ? variant.price
                  : variant.price === null
                  ? null
                  : undefined,
              isActive:
                typeof variant.isActive === "boolean"
                  ? variant.isActive
                  : undefined,
            },
          })
      )
    );

    const updated = await db.product.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            values: {
              include: {
                optionValue: {
                  include: {
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id]/variants error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update variants" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body.variantId) {
      return NextResponse.json(
        { success: false, error: "variantId is required" },
        { status: 400 }
      );
    }

    const variant = await db.productVariant.findFirst({
      where: {
        id: body.variantId,
        productId: id,
      },
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, error: "Variant not found" },
        { status: 404 }
      );
    }

    await db.productVariant.delete({
      where: { id: body.variantId },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id]/variants error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete variant" },
      { status: 500 }
    );
  }
}