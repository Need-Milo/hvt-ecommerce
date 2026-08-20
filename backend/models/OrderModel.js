import { pool } from "../config/db.js";

async function attachItems(orders) {
  if (!orders.length) return orders;
  const ids = orders.map((order) => order.id); const placeholders = ids.map(() => "?").join(",");
  const [items] = await pool.query(`SELECT id, order_id AS orderId, product_id AS productId, product_name AS productName, unit_price AS unitPrice, quantity, subtotal FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`, ids);
  const byOrder = new Map(); for (const item of items) { const list = byOrder.get(item.orderId) || []; list.push(item); byOrder.set(item.orderId, list); }
  return orders.map((order) => ({ ...order, items: byOrder.get(order.id) || [] }));
}

export const OrderModel = {
  async findByUserId(userId) { const [orders] = await pool.execute("SELECT id, order_code AS orderCode, user_id AS userId, receiver_name AS receiverName, phone, shipping_address AS shippingAddress, total_amount AS totalAmount, status, created_at AS createdAt FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]); return attachItems(orders); },
  async findById(id) { const [orders] = await pool.execute("SELECT id, order_code AS orderCode, user_id AS userId, receiver_name AS receiverName, phone, shipping_address AS shippingAddress, total_amount AS totalAmount, status, created_at AS createdAt FROM orders WHERE id = ?", [id]); return (await attachItems(orders))[0] || null; },
  async checkout({ userId, receiverName, phone, address, cart, cartItems }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      let totalAmount = 0; const items = [];
      for (const cartItem of cartItems) {
        const [products] = await connection.execute("SELECT id, name, price, stock_quantity AS stockQuantity FROM products WHERE id = ? FOR UPDATE", [cartItem.productId]);
        const product = products[0];
        if (!product || product.stockQuantity < cartItem.quantity) throw Object.assign(new Error(`Not enough stock for ${product?.name || "product"}`), { status: 400 });
        const subtotal = Number(product.price) * cartItem.quantity; totalAmount += subtotal;
        items.push({ product, quantity: cartItem.quantity, subtotal });
      }
      const [orderResult] = await connection.execute("INSERT INTO orders (order_code, user_id, receiver_name, phone, shipping_address, total_amount, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', NOW(3))", [`TEMP-${Date.now()}`, userId, receiverName, phone, address, totalAmount]);
      await connection.execute("UPDATE orders SET order_code = ? WHERE id = ?", [`ORD-${orderResult.insertId}`, orderResult.insertId]);
      for (const item of items) { await connection.execute("INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)", [orderResult.insertId, item.product.id, item.product.name, item.product.price, item.quantity, item.subtotal]); await connection.execute("UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = NOW(3) WHERE id = ?", [item.quantity, item.product.id]); }
      await connection.execute("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);
      await connection.commit(); return this.findById(orderResult.insertId);
    } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
  },
};
