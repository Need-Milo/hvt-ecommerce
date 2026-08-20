import { pool } from "../config/db.js";
import { ProductModel } from "./ProductModel.js";

async function cartForUser(userId) {
  await pool.execute("INSERT IGNORE INTO carts (user_id, updated_at) VALUES (?, NOW(3))", [userId]);
  const [rows] = await pool.execute("SELECT id, user_id AS userId FROM carts WHERE user_id = ?", [userId]);
  return rows[0];
}

export const CartModel = {
  getOrCreateByUserId: cartForUser,
  async getItemsByUserId(userId) {
    const cart = await cartForUser(userId);
    const [items] = await pool.execute("SELECT id, product_id AS productId, quantity FROM cart_items WHERE cart_id = ? ORDER BY id ASC", [cart.id]);
    for (const item of items) item.product = await ProductModel.findById(item.productId);
    return { cart, items };
  },
  async findItem(cartId, productId) { const [rows] = await pool.execute("SELECT id, cart_id AS cartId, product_id AS productId, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?", [cartId, productId]); return rows[0] || null; },
  async findItemInCart(itemId, cartId) { const [rows] = await pool.execute("SELECT id, cart_id AS cartId, product_id AS productId, quantity FROM cart_items WHERE id = ? AND cart_id = ?", [itemId, cartId]); if (!rows[0]) return null; return { ...rows[0], product: await ProductModel.findById(rows[0].productId) }; },
  async createItem(cartId, productId, quantity) { const [result] = await pool.execute("INSERT INTO cart_items (cart_id, product_id, quantity, updated_at) VALUES (?, ?, ?, NOW(3))", [cartId, productId, quantity]); return this.findItemInCart(result.insertId, cartId); },
  async updateItemQuantity(itemId, quantity) { await pool.execute("UPDATE cart_items SET quantity = ?, updated_at = NOW(3) WHERE id = ?", [quantity, itemId]); const [rows] = await pool.execute("SELECT cart_id AS cartId FROM cart_items WHERE id = ?", [itemId]); return this.findItemInCart(itemId, rows[0].cartId); },
  deleteItem(itemId) { return pool.execute("DELETE FROM cart_items WHERE id = ?", [itemId]); },
  clearItems(cartId) { return pool.execute("DELETE FROM cart_items WHERE cart_id = ?", [cartId]); },
};
