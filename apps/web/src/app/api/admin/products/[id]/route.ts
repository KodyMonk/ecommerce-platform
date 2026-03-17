import { NextResponse } from "next/server";
import { deleteAdminProduct, updateAdminProduct } from "@/lib/admin-products";

export const runtime = "nodejs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();

    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim();
    const shortDescription = String(body.shortDescription || "");
    const description = String(body.description || "");
    const basePrice = Number(body.basePrice || 0);
    const stock = Number(body.stock || 0);
    const brandId = body.brandId ? String(body.brandId) : null;
    const categoryId = body.categoryId ? String(body.categoryId) : null;
    const imageUrl = body.imageUrl ? String(body.imageUrl) : null;
    const isActive = Boolean(body.isActive);
    const isFeatured = Boolean(body.isFeatured);

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "name and slug are required" },
        { status: 400 }
      );
    }

    const product = await updateAdminProduct(id, {
      name,
      slug,
      shortDescription,
      description,
      basePrice,
      stock,
      brandId,
      categoryId,
      imageUrl,
      isActive,
      isFeatured,
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Props) {
  try {
    const { id } = await params;

    await deleteAdminProduct(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 }
    );
  }
}