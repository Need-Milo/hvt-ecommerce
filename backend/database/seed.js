import bcrypt from "bcryptjs";
import { disconnectDB, prisma } from "../config/db.js";

const backendUrl = (process.env.BACKEND_URL || "http://localhost:5000").replace(
  /\/$/,
  "",
);

const sampleProducts = [
  {
    name: "iPhone 11",
    slug: "iphone-11",
    category: "gadget",
    price: 99,
    stock: 12,
    featured: true,
    image: "product_1.png",
    specifications: [
      ["Màn hình", "6.1 inch"],
      ["Camera", "Camera kép 12MP"],
      ["Bảo hành", "12 tháng"],
    ],
  },
  {
    name: "Sony Headphone",
    slug: "sony-headphone",
    category: "appliances",
    price: 400,
    stock: 6,
    featured: true,
    image: "product_16.png",
    specifications: [
      ["Kết nối", "Bluetooth"],
      ["Loại", "Over-ear"],
      ["Bảo hành", "12 tháng"],
    ],
  },
  {
    name: "Refrigerator",
    slug: "refrigerator",
    category: "refrigerators",
    price: 800,
    stock: 8,
    featured: false,
    image: "product_18.png",
    specifications: [
      ["Loại", "Tủ lạnh"],
      ["Dung tích", "300 lít"],
      ["Bảo hành", "12 tháng"],
    ],
  },
];

async function main() {
  for (const [name, slug] of [
    ["Gadget", "gadget"],
    ["Appliances", "appliances"],
    ["Refrigerators", "refrigerators"],
  ]) {
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  const passwordHash = await bcrypt.hash("user123", 10);
  await prisma.user.upsert({
    where: { email: "user@shop.com" },
    update: {},
    create: {
      fullName: "Nguyen Van A",
      email: "user@shop.com",
      passwordHash,
      cart: { create: {} },
    },
  });

  for (const product of sampleProducts) {
    const category = await prisma.category.findUnique({
      where: { slug: product.category },
    });

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        price: product.price,
        stockQuantity: product.stock,
        isFeatured: product.featured,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: `${product.name} — sản phẩm chất lượng cho nhu cầu hằng ngày.`,
        price: product.price,
        stockQuantity: product.stock,
        isFeatured: product.featured,
        categoryId: category.id,
        productSpecifications: {
          create: product.specifications.map(([name, value], sortOrder) => ({
            specificationName: name,
            specificationValue: value,
            sortOrder,
          })),
        },
      },
    });

    const imageUrl = `${backendUrl}/images/products/${product.image}`;
    const primaryImage = await prisma.productImage.findFirst({
      where: { productId: saved.id },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    if (primaryImage) {
      await prisma.productImage.update({
        where: { id: primaryImage.id },
        data: { imageUrl, sortOrder: 0 },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: saved.id,
          imageUrl,
          sortOrder: 0,
        },
      });
    }

    console.log(`Seeded product: ${saved.name}`);
  }

  console.log("Prisma seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(disconnectDB);
