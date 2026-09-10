import bcrypt from "bcryptjs";
import { disconnectDB, prisma } from "../config/db.js";
import { productsData } from "../data/products.js";

const backendUrl = (process.env.BACKEND_URL || "http://localhost:5000").replace(
  /\/$/,
  "",
);

const CATEGORIES = [
  ["Điện tử", "gadget"],
  ["Gia dụng", "appliances"],
  ["Tủ lạnh", "refrigerators"],
  ["Khác", "others"],
];

function toSlug(name, id, used) {
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (!slug) slug = `product-${id}`;
  if (used.has(slug)) slug = `${slug}-${id}`;
  used.add(slug);
  return slug;
}

function resolveImageUrl(image) {
  if (!image) return `${backendUrl}/images/products/product_1.png`;
  if (/^https?:\/\//i.test(image)) return image;
  return `${backendUrl}/images/products/${image}`;
}

const usedSlugs = new Set();
const sampleProducts = productsData.map((product) => ({
  name: product.name,
  slug: toSlug(product.name, product.id, usedSlugs),
  category: product.type || "others",
  price: product.price,
  stock: product.stock,
  featured: product.status === "hot" || product.status === "new",
  imageUrl: resolveImageUrl(product.image?.[0]),
  description:
    product.description ||
    `${product.name} — sản phẩm chất lượng cho nhu cầu hằng ngày.`,
  specifications: [
    ["Danh mục", product.type || "others"],
    ["Bảo hành", "12 tháng"],
  ],
}));

async function main() {
  for (const [name, slug] of CATEGORIES) {
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

    if (!category) {
      console.warn(`Skip ${product.name}: missing category ${product.category}`);
      continue;
    }

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stock,
        isFeatured: product.featured,
        categoryId: category.id,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
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

    const primaryImage = await prisma.productImage.findFirst({
      where: { productId: saved.id },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    if (primaryImage) {
      await prisma.productImage.update({
        where: { id: primaryImage.id },
        data: { imageUrl: product.imageUrl, sortOrder: 0 },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: saved.id,
          imageUrl: product.imageUrl,
          sortOrder: 0,
        },
      });
    }

    console.log(`Seeded product: ${saved.name}`);
  }

  const total = await prisma.product.count();
  console.log(`Prisma seed completed. Total products: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(disconnectDB);
