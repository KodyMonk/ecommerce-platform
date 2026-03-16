import { NextResponse } from "next/server";
import {
  createAdminProduct,
  updateAdminProduct,
} from "../../../../lib/admin-products";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const product = await createAdminProduct({
      name: data.name,
      slug: data.slug,
      basePrice: Number(data.basePrice),
      description: data.description || "",
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    const product = await updateAdminProduct(data.id, {
      name: data.name,
      slug: data.slug,
      basePrice: Number(data.basePrice),
      description: data.description || "",
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}