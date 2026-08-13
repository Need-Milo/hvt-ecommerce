import { CartModel } from "../models/CartModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { mapCartItem } from "../utils/mappers.js";

export const cartController = {
  async getCart(req, res) {
    try {
      const { items } = await CartModel.getItemsByUserId(req.user.id);
      const mapped = items.map(mapCartItem);
      const totalAmount = mapped.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      return res.json({ items: mapped, totalAmount });
    } catch (error) {
      console.error("Get cart error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  async addItem(req, res) {
    try {
      const productId = Number(req.body.productId);
      const quantity = Number(req.body.quantity);

      if (!productId || Number.isNaN(productId)) {
        return res.status(400).json({ message: "productId không hợp lệ" });
      }
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "quantity phải > 0" });
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      const cart = await CartModel.getOrCreateByUserId(req.user.id);
      const existing = await CartModel.findItem(cart.id, productId);
      const nextQty = (existing?.quantity || 0) + quantity;

      if (nextQty > product.stockQuantity) {
        return res.status(400).json({
          message: `Không đủ tồn kho cho ${product.name}`,
        });
      }

      const item = existing
        ? await CartModel.updateItemQuantity(existing.id, nextQty)
        : await CartModel.createItem(cart.id, productId, quantity);

      return res.status(201).json(mapCartItem(item));
    } catch (error) {
      console.error("Add cart item error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  async updateItem(req, res) {
    try {
      const quantity = Number(req.body.quantity);
      if (Number.isNaN(quantity) || quantity < 0) {
        return res.status(400).json({ message: "quantity không hợp lệ" });
      }

      const cart = await CartModel.getOrCreateByUserId(req.user.id);
      const item = await CartModel.findItemInCart(req.params.id, cart.id);
      if (!item) {
        return res.status(404).json({ message: "Không tìm thấy item trong giỏ" });
      }

      if (quantity === 0) {
        await CartModel.deleteItem(item.id);
        return res.json({ id: Number(item.id), quantity: 0 });
      }

      if (quantity > item.product.stockQuantity) {
        return res.status(400).json({
          message: `Không đủ tồn kho cho ${item.product.name}`,
        });
      }

      const updated = await CartModel.updateItemQuantity(item.id, quantity);
      return res.json(mapCartItem(updated));
    } catch {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
  },

  async removeItem(req, res) {
    try {
      const cart = await CartModel.getOrCreateByUserId(req.user.id);
      const item = await CartModel.findItemInCart(req.params.id, cart.id);
      if (!item) {
        return res.status(404).json({ message: "Không tìm thấy item trong giỏ" });
      }
      await CartModel.deleteItem(item.id);
      return res.json({ itemId: Number(item.id) });
    } catch {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
  },

  async clearCart(req, res) {
    try {
      const cart = await CartModel.getOrCreateByUserId(req.user.id);
      await CartModel.clearItems(cart.id);
      return res.json({ message: "Đã xóa toàn bộ giỏ hàng" });
    } catch (error) {
      console.error("Clear cart error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },
};
