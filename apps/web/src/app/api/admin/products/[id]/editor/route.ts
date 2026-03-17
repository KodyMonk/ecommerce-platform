import { NextResponse } from "next/server";
import { db } from "@ecommerce/db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type VariantPayload = {
  id?: string;
  title: string;
  stock: number;
  price: number | null;
  isActive: boolean;
  optionName?: string;
  optionValue?: string;
};

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const product = await db.product.findUnique({
      where: { id },
      include: {
        images: true,
        options: {
          include: {
            values: true,
          },
        },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name: body.name,
          slug: body.slug,
          shortDescription: body.shortDescription || null,
          description: body.description || null,
          basePrice: Number(body.basePrice),
          stock: Number(body.stock || 0),
          brandId: body.brandId || null,
          categoryId: body.categoryId || null,
          isActive: Boolean(body.isActive),
          isFeatured: Boolean(body.isFeatured),
        },
      });

      const existingImage = product.images[0];

      if (body.imageUrl && String(body.imageUrl).trim()) {
        if (existingImage) {
          await tx.productImage.update({
            where: { id: existingImage.id },
            data: {
              url: body.imageUrl,
              alt: body.name,
              isPrimary: true,
              sortOrder: 0,
            },
          });
        } else {
          await tx.productImage.create({
            data: {
              productId: id,
              url: body.imageUrl,
              alt: body.name,
              isPrimary: true,
              sortOrder: 0,
            },
          });
        }
      }

      const variants: VariantPayload[] = Array.isArray(body.variants)
        ? body.variants
        : [];

      const optionCache = await tx.productOption.findMany({
        where: {
          productId: id,
        },
        include: {
          values: true,
        },
      });

      for (const variant of variants) {
        if (variant.id) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              title: variant.title,
              stock: Number(variant.stock || 0),
              price:
                variant.price === null || variant.price === undefined
                  ? null
                  : Number(variant.price),
              isActive: Boolean(variant.isActive),
            },
          });

          continue;
        }

        const optionName = (variant.optionName || "Option").trim();
        const optionValueText = (variant.optionValue || variant.title).trim();

        let option = optionCache.find(
          (item) => item.name.toLowerCase() === optionName.toLowerCase()
        );

        if (!option) {
          option = await tx.productOption.create({
            data: {
              productId: id,
              name: optionName,
              sortOrder: optionCache.length,
            },
            include: {
              values: true,
            },
          });

          optionCache.push(option);
        }

        let optionValue = option.values.find(
          (value) => value.value.toLowerCase() === optionValueText.toLowerCase()
        );

        if (!optionValue) {
          optionValue = await tx.productOptionValue.create({
            data: {
              optionId: option.id,
              value: optionValueText,
              sortOrder: option.values.length,
            },
          });

          option.values.push(optionValue);
        }

        const createdVariant = await tx.productVariant.create({
          data: {
            productId: id,
            title: variant.title,
            stock: Number(variant.stock || 0),
            price:
              variant.price === null || variant.price === undefined
                ? Number(body.basePrice)
                : Number(variant.price),
            isActive: Boolean(variant.isActive),
            trackInventory: true,
            isDefault: false,
          },
        });

        await tx.productVariantValue.create({
          data: {
            variantId: createdVariant.id,
            optionValueId: optionValue.id,
          },
        });
      }

      return updatedProduct;
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id]/editor error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to save product editor state" },
      { status: 500 }
    );
  }
}