import { CartModel } from "../models/CartModel.js";
import { OrderModel } from "../models/OrderModel.js";
import { mapOrder } from "../utils/mappers.js";

export const orderController = {
  async list(req, res) {
    try {
      const orders = await OrderModel.findByUserId(req.user.id);
      return res.json(orders.map(mapOrder));
    } catch (error) {
      console.error("List orders error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  async detail(req, res) {
    try {
      const order = await OrderModel.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      if (Number(order.userId) !== Number(req.user.id)) {
        return res.status(403).json({ message: "Không có quyền xem đơn này" });
      }
      return res.json(mapOrder(order));
    } catch {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
  },

  async create(req, res) {
    try {
      const receiverName = (
        req.body.receiverName ||
        req.body.nameUser ||
        ""
      ).trim();
      const phone = (req.body.phone || "").trim();
      const address = (req.body.address || req.body.shippingAddress || "").trim();

      if (!receiverName || !phone || !address) {
        return res.status(400).json({
          message: "Thiếu thông tin giao hàng (họ tên, SĐT, địa chỉ)",
        });
      }

      const { cart, items: cartItems } = await CartModel.getItemsByUserId(
        req.user.id
      );
      if (!cartItems.length) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const order = await OrderModel.checkout({
        userId: req.user.id,
        receiverName,
        phone,
        address,
        cart,
        cartItems,
      });

      return res.status(201).json(mapOrder(order));
    } catch (error) {
      console.error("Create order error:", error);
      if (error.status === 400) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },
};
