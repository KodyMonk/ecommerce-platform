import bcrypt from "bcryptjs";
import { db } from "../src";

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("admin12345", 10);

  const admin = await db.user.upsert({
    where: {
      email: "admin@shop.com",
    },
    update: {
      name: "Admin",
      role: "ADMIN",
      password: hashedPassword,
      isActive: true,
    },
    create: {
      email: "admin@shop.com",
      name: "Admin",
      role: "ADMIN",
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log("Admin seeded:", admin.email);

  const brand = await db.brand.upsert({
    where: {
      slug: "tiffany-co",
    },
    update: {
      name: "Tiffany & Co",
      isActive: true,
    },
    create: {
      name: "Tiffany & Co",
      slug: "tiffany-co",
      isActive: true,
    },
  });

  const category = await db.category.upsert({
    where: {
      slug: "perfumes",
    },
    update: {
      name: "Perfumes",
      isActive: true,
      sortOrder: 1,
    },
    create: {
      name: "Perfumes",
      slug: "perfumes",
      isActive: true,
      sortOrder: 1,
    },
  });

  const product = await db.product.upsert({
    where: {
      slug: "tiffany-edp-intense",
    },
    update: {
      name: "Tiffany & Co Eau De Parfum Intense",
      shortDescription: "Luxury fragrance",
      description: "Rich iris fragrance with amber and vanilla.",
      basePrice: 68.2,
      stock: 10,
      currency: "BHD",
      isActive: true,
      isFeatured: true,
      brandId: brand.id,
      categoryId: category.id,
    },
    create: {
      name: "Tiffany & Co Eau De Parfum Intense",
      slug: "tiffany-edp-intense",
      shortDescription: "Luxury fragrance",
      description: "Rich iris fragrance with amber and vanilla.",
      basePrice: 68.2,
      stock: 10,
      currency: "BHD",
      isActive: true,
      isFeatured: true,
      brandId: brand.id,
      categoryId: category.id,
    },
  });

  // Clean old seed-related rows for this product so the seed is repeatable
  await db.productVariantValue.deleteMany({
    where: {
      variant: {
        productId: product.id,
      },
    },
  });

  await db.productVariant.deleteMany({
    where: {
      productId: product.id,
    },
  });

  await db.productOptionValue.deleteMany({
    where: {
      option: {
        productId: product.id,
      },
    },
  });

  await db.productOption.deleteMany({
    where: {
      productId: product.id,
    },
  });

  await db.productImage.deleteMany({
    where: {
      productId: product.id,
    },
  });

  await db.productImage.create({
    data: {
      productId: product.id,
      url: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
      alt: "Tiffany & Co Eau De Parfum Intense",
      isPrimary: true,
      sortOrder: 0,
    },
  });

  const sizeOption = await db.productOption.create({
    data: {
      productId: product.id,
      name: "Size",
      sortOrder: 0,
    },
  });

  const size75 = await db.productOptionValue.create({
    data: {
      optionId: sizeOption.id,
      value: "75ml",
      sortOrder: 0,
    },
  });

  const size100 = await db.productOptionValue.create({
    data: {
      optionId: sizeOption.id,
      value: "100ml",
      sortOrder: 1,
    },
  });

  const variant75 = await db.productVariant.create({
    data: {
      productId: product.id,
      title: "75ml",
      stock: 5,
      price: 68.2,
      isDefault: true,
      isActive: true,
      trackInventory: true,
    },
  });

  await db.productVariantValue.create({
    data: {
      variantId: variant75.id,
      optionValueId: size75.id,
    },
  });

  const variant100 = await db.productVariant.create({
    data: {
      productId: product.id,
      title: "100ml",
      stock: 5,
      price: 82.5,
      isDefault: false,
      isActive: true,
      trackInventory: true,
    },
  });

  await db.productVariantValue.create({
    data: {
      variantId: variant100.id,
      optionValueId: size100.id,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });