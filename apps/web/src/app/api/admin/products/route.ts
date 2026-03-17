import { NextResponse } from "next/server";
import { createAdminProduct } from "@/lib/admin-products";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim();
    const shortDescription = String(body.shortDescription || "");
    const description = String(body.description || "");
    const basePrice = Number(body.basePrice || 0);
    const stock = Number(body.stock || 0);
    const brandId = body.brandId ? String(body.brandId) : null;
    const categoryId = body.categoryId ? String(body.categoryId) : null;
    const isActive = Boolean(body.isActive);
    const isFeatured = Boolean(body.isFeatured);
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.map((item: unknown) => String(item))
      : [];

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "name and slug are required" },
        { status: 400 }
      );
    }

    const product = await createAdminProduct({
      name,
      slug,
      shortDescription,
      description,
      basePrice,
      stock,
      brandId,
      categoryId,
      imageUrls,
      isActive,
      isFeatured,
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 500 }
    );
  }
}