import { NextResponse } from "next/server";
import { createSingleOptionVariants } from "../../../../../../../lib/admin-products";

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

    if (!body.optionName || !Array.isArray(body.values)) {
      return NextResponse.json(
        { success: false, error: "optionName and values are required" },
        { status: 400 }
      );
    }

    const product = await createSingleOptionVariants({
      productId: id,
      optionName: body.optionName,
      values: body.values,
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("POST /api/admin/products/[id]/variants/create error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create variants" },
      { status: 500 }
    );
  }
}