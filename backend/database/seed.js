import bcrypt from "bcryptjs";
import { disconnectDB, pool } from "../config/db.js";

const sampleProducts = [
  { name: "iPhone 11", slug: "iphone-11", category: "gadget", price: 99, stock: 12, featured: true, image: "product_1.png", specifications: [["Màn hình", "6.1 inch"], ["Camera", "Camera kép 12MP"], ["Bảo hành", "12 tháng"]] },
  { name: "Sony Headphone", slug: "sony-headphone", category: "appliances", price: 400, stock: 6, featured: true, image: "product_16.png", specifications: [["Kết nối", "Bluetooth"], ["Loại", "Over-ear"], ["Bảo hành", "12 tháng"]] },
  { name: "Refrigerator", slug: "refrigerator", category: "refrigerators", price: 800, stock: 8, featured: false, image: "product_18.png", specifications: [["Loại", "Tủ lạnh"], ["Dung tích", "300 lít"], ["Bảo hành", "12 tháng"]] },
];

async function main() {
  for (const [name, slug] of [["Gadget", "gadget"], ["Appliances", "appliances"], ["Refrigerators", "refrigerators"]]) {
    await pool.execute("INSERT IGNORE INTO categories (name, slug, updated_at) VALUES (?, ?, NOW(3))", [name, slug]);
  }
  const passwordHash = await bcrypt.hash("user123", 10);
  await pool.execute("INSERT IGNORE INTO users (full_name, email, password_hash, updated_at) VALUES (?, ?, ?, NOW(3))", ["Nguyen Van A", "user@shop.com", passwordHash]);

  for (const product of sampleProducts) {
    const [[category]] = await pool.execute("SELECT id FROM categories WHERE slug = ?", [product.category]);
    await pool.execute("INSERT IGNORE INTO products (category_id, name, slug, description, price, stock_quantity, is_featured, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3))", [category.id, product.name, product.slug, `${product.name} — sản phẩm chất lượng cho nhu cầu hằng ngày.`, product.price, product.stock, product.featured]);
    const [[savedProduct]] = await pool.execute("SELECT id FROM products WHERE slug = ?", [product.slug]);
    await pool.execute("INSERT IGNORE INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, 0)", [savedProduct.id, `http://localhost:5000/images/products/${product.image}`]);
    for (const [sortOrder, [name, value]] of product.specifications.entries()) {
      await pool.execute("INSERT IGNORE INTO product_specifications (product_id, specification_name, specification_value, sort_order) VALUES (?, ?, ?, ?)", [savedProduct.id, name, value, sortOrder]);
    }
  }
  console.log("SQL seed completed: 3 products, images and specifications.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(disconnectDB);
