import { CategoryModel } from "../models/CategoryModel.js";

export const categoryController = {
  async list(_req, res) {
    try {
      const categories = await CategoryModel.findAll();
      return res.json(
        categories.map((c) => ({
          id: Number(c.id),
          name: c.name,
          slug: c.slug,
          productCount: c._count?.products ?? 0,
        }))
      );
    } catch (error) {
      console.error("Categories error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },
};
