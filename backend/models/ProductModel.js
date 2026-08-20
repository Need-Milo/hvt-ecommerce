import { pool } from "../config/db.js";

const productColumns = `p.id, p.category_id AS categoryId, p.name, p.slug, p.description, p.price, p.stock_quantity AS stockQuantity, p.specifications, p.is_featured AS isFeatured, p.created_at AS createdAt, p.updated_at AS updatedAt, c.id AS category_id, c.name AS category_name, c.slug AS category_slug`;

async function attachImages(products) {
  if (!products.length) return products;
  const ids = products.map((product) => product.id);
  const placeholders = ids.map(() => "?").join(",");
  const [images] = await pool.query(`SELECT product_id, id, image_url AS imageUrl, sort_order AS sortOrder FROM product_images WHERE product_id IN (${placeholders}) ORDER BY sort_order ASC`, ids);
  const imagesByProduct = new Map();
  for (const image of images) {
    const list = imagesByProduct.get(image.product_id) || [];
    list.push(image); imagesByProduct.set(image.product_id, list);
  }
  const [specRows] = await pool.query(`SELECT product_id, specification_name, specification_value FROM product_specifications WHERE product_id IN (${placeholders}) ORDER BY sort_order ASC`, ids);
  const specificationsByProduct = new Map();
  for (const specification of specRows) {
    const values = specificationsByProduct.get(specification.product_id) || {};
    values[specification.specification_name] = specification.specification_value;
    specificationsByProduct.set(specification.product_id, values);
  }
  return products.map((product) => ({ ...product, specifications: specificationsByProduct.get(product.id) || {}, category: { id: product.category_id, name: product.category_name, slug: product.category_slug }, images: imagesByProduct.get(product.id) || [] }));
}

export const ProductModel = {
  async findMany(query = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const clauses = []; const values = [];
    if (query.search?.trim()) { clauses.push("p.name LIKE ?"); values.push(`%${query.search.trim()}%`); }
    if (query.category?.trim()) { clauses.push("(c.slug = ? OR c.name = ? OR c.id = ?)"); values.push(query.category.trim(), query.category.trim(), Number(query.category) || 0); }
    if (!Number.isNaN(Number(query.minPrice))) { clauses.push("p.price >= ?"); values.push(Number(query.minPrice)); }
    if (!Number.isNaN(Number(query.maxPrice))) { clauses.push("p.price <= ?"); values.push(Number(query.maxPrice)); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const sorting = { price_asc: "p.price ASC", price_desc: "p.price DESC", name_asc: "p.name ASC", name_az: "p.name ASC", name_desc: "p.name DESC", name_za: "p.name DESC" }[query.sort] || "p.id ASC";
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM products p JOIN categories c ON c.id = p.category_id ${where}`, values);
    const [rows] = await pool.query(`SELECT ${productColumns} FROM products p JOIN categories c ON c.id = p.category_id ${where} ORDER BY ${sorting} LIMIT ? OFFSET ?`, [...values, limit, (page - 1) * limit]);
    return { products: await attachImages(rows), page, limit, total, totalPages: Math.ceil(total / limit) || 1 };
  },
  async findFeatured(take = 12) { const [rows] = await pool.query(`SELECT ${productColumns} FROM products p JOIN categories c ON c.id = p.category_id WHERE p.is_featured = TRUE ORDER BY p.id ASC LIMIT ?`, [take]); return attachImages(rows); },
  async findById(id) { const [rows] = await pool.execute(`SELECT ${productColumns} FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`, [id]); return (await attachImages(rows))[0] || null; },
  async findRelated(productId, categoryId, take = 8) { const [rows] = await pool.query(`SELECT ${productColumns} FROM products p JOIN categories c ON c.id = p.category_id WHERE p.category_id = ? AND p.id <> ? ORDER BY p.id ASC LIMIT ?`, [categoryId, productId, take]); return attachImages(rows); },
};
