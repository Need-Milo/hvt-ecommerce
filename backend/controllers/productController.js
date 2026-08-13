import { ProductModel } from "../models/ProductModel.js";
import { mapProduct } from "../utils/mappers.js";

export const productController = {
  async list(req, res) {
    try {
      const result = await ProductModel.findMany(req.query);
      return res.json({
        items: result.products.map(mapProduct),
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error("Products list error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  async featured(_req, res) {
    try {
      const products = await ProductModel.findFeatured();
      return res.json(products.map(mapProduct));
    } catch (error) {
      console.error("Featured products error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  async detail(req, res) {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      return res.json(mapProduct(product));
    } catch {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
  },

  async related(req, res) {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      const related = await ProductModel.findRelated(product.id, product.categoryId);
      return res.json(related.map(mapProduct));
    } catch {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
  },
};
