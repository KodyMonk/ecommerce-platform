import { NextResponse } from "next/server";
import { createMultiOptionVariants } from "../../../../../../../lib/admin-products";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!Array.isArray(body.options)) {
      return NextResponse.json(
        { success: false, error: "options must be an array" },
        { status: 400 }
      );
    }

    const product = await createMultiOptionVariants({
      productId: id,
      options: body.options,
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("POST /api/admin/products/[id]/variants/generate error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to generate variants" },
      { status: 500 }
    );
  }
}