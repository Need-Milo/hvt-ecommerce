import bcrypt from "bcryptjs";
import { prisma, disconnectDB } from "../config/db.js";

const categories = [
  { name: "Gadget", slug: "gadget" },
  { name: "Appliances", slug: "appliances" },
  { name: "Refrigerators", slug: "refrigerators" },
  { name: "Others", slug: "others" },
];

const productsSeed = [
  { name: "iPhone 11", price: 99, stock: 12, category: "gadget", featured: true, image: "product_1.png" },
  { name: "HeadPhone", price: 100, stock: 5, category: "gadget", featured: false, image: "product_3.png" },
  { name: "SmartWatch", price: 140, stock: 18, category: "gadget", featured: true, image: "product_4.png" },
  { name: "Washing Machine", price: 360, stock: 9, category: "gadget", featured: false, image: "product_5.png" },
  { name: "TV", price: 780, stock: 0, category: "gadget", featured: false, image: "product_6.png" },
  { name: "Ceiling fan", price: 250, stock: 14, category: "gadget", featured: false, image: "product_7.png" },
  { name: "iMac", price: 450, stock: 3, category: "gadget", featured: true, image: "product_8.png" },
  { name: "Blender", price: 80, stock: 7, category: "gadget", featured: false, image: "product_9.png" },
  { name: "Speaker", price: 70, stock: 0, category: "gadget", featured: false, image: "product_10.png" },
  { name: "iPhone 14", price: 300, stock: 16, category: "gadget", featured: true, image: "product_11.png" },
  { name: "Vacuum Cleaner", price: 600, stock: 4, category: "gadget", featured: false, image: "product_12.png" },
  { name: "Laptop", price: 200, stock: 11, category: "gadget", featured: true, image: "product_13.png" },
  { name: "SamSung", price: 430, stock: 2, category: "gadget", featured: false, image: "product_14.png" },
  { name: "Redmi", price: 130, stock: 19, category: "appliances", featured: false, image: "product_15.png" },
  { name: "Sony Headphone", price: 400, stock: 6, category: "appliances", featured: true, image: "product_16.png" },
  { name: "Washing Machine Pro", price: 500, stock: 0, category: "refrigerators", featured: false, image: "product_17.png" },
  { name: "Refrigerator", price: 800, stock: 8, category: "refrigerators", featured: true, image: "product_18.png" },
  { name: "Sony Refrigerator", price: 900, stock: 13, category: "gadget", featured: true, image: "product_19.png" },
  { name: "TV MSI", price: 450, stock: 1, category: "others", featured: false, image: "product_20.png" },
  { name: "AirPods", price: 250, stock: 0, category: "others", featured: false, image: "product_21.png" },
  { name: "Camera Canon", price: 150, stock: 10, category: "others", featured: false, image: "product_22.png" },
  { name: "Panasonic", price: 550, stock: 5, category: "others", featured: true, image: "product_23.png" },
];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function imageUrl(file) {
  const base = process.env.SEED_IMAGE_BASE || "http://localhost:5000/images/products";
  return `${base}/${file}`;
}

async function main() {
  console.log("Seeding MySQL database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created;
  }

  const passwordHash = await bcrypt.hash("user123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin",
      email: "admin@shop.com",
      passwordHash: adminHash,
      cart: { create: {} },
    },
  });

  const user = await prisma.user.create({
    data: {
      fullName: "Nguyen Van A",
      email: "user@shop.com",
      passwordHash,
      cart: { create: {} },
    },
  });

  for (const p of productsSeed) {
    const slug = slugify(p.name);
    await prisma.product.create({
      data: {
        name: p.name,
        slug: `${slug}-${Math.random().toString(36).slice(2, 6)}`,
        description: `${p.name} — sản phẩm chất lượng, phù hợp nhu cầu hằng ngày.`,
        price: p.price,
        stockQuantity: p.stock,
        isFeatured: p.featured,
        categoryId: categoryMap[p.category].id,
        specifications: {
          Brand: "Shopcart",
          Warranty: "12 months",
          Origin: "Vietnam",
        },
        images: {
          create: [0, 1, 2].map((i) => ({
            imageUrl: imageUrl(p.image),
            sortOrder: i,
          })),
        },
      },
    });
  }

  console.log("Seed done.");
  console.log("Users:");
  console.log(`- ${admin.email} / admin123`);
  console.log(`- ${user.email} / user123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectDB();
  });
