import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding database...");

  const perfumeCategory = await prisma.category.create({
    data: {
      name: "Perfumes",
      slug: "perfumes",
      description: "Luxury fragrances",
    },
  });

  const tiffany = await prisma.brand.create({
    data: {
      name: "Tiffany & Co",
      slug: "tiffany-co",
    },
  });

  const perfume = await prisma.product.create({
    data: {
      name: "Tiffany & Co Eau De Parfum Intense",
      slug: "tiffany-edp-intense",
      shortDescription: "Luxury fragrance",
      description: "Rich iris fragrance with amber and vanilla.",
      basePrice: 68.2,
      stock: 10,
      currency: "BHD",
      categoryId: perfumeCategory.id,
      brandId: tiffany.id,
      isActive: true,
      isFeatured: true,
    },
  });

  const sizeOption = await prisma.productOption.create({
    data: {
      productId: perfume.id,
      name: "Size",
    },
  });

  const size75 = await prisma.productOptionValue.create({
    data: {
      optionId: sizeOption.id,
      value: "75ml",
    },
  });

  const size100 = await prisma.productOptionValue.create({
    data: {
      optionId: sizeOption.id,
      value: "100ml",
    },
  });

  const variant75 = await prisma.productVariant.create({
    data: {
      productId: perfume.id,
      title: "75ml",
      price: 68.2,
      stock: 5,
      isDefault: true,
    },
  });

  const variant100 = await prisma.productVariant.create({
    data: {
      productId: perfume.id,
      title: "100ml",
      price: 82.5,
      stock: 5,
    },
  });

  await prisma.productVariantValue.create({
    data: {
      variantId: variant75.id,
      optionValueId: size75.id,
    },
  });

  await prisma.productVariantValue.create({
    data: {
      variantId: variant100.id,
      optionValueId: size100.id,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      isActive: true,
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@shop.com",
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Seed completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });