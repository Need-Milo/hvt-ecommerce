import express from "express";
import { productsData } from "../data/products.js";

const router = express.Router();

const withCatalogFields = (product) => ({
  ...product,
  featured:
    product.featured === true ||
    product.status === "hot" ||
    product.status === "new" ||
    product.status === "sale",
  specifications: product.specifications || {
    "Danh mục": product.type || "Khác",
    "Mã sản phẩm": String(product.id),
    "Tình trạng": product.stock > 0 ? "Còn hàng" : "Hết hàng",
    "Bảo hành": "12 tháng",
    "Xuất xứ": "Chính hãng",
  },
});

router.get("/", (req, res) => {
  res.json(productsData.map(withCatalogFields));
});

router.post("/", (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  productsData.push(newProduct);
  res.json(newProduct);
});

router.delete("/:id", (req, res) => {
  const index = productsData.findIndex(p => p.id == req.params.id);
  productsData.splice(index, 1);
  res.json({ message: "Deleted" });
});

export default router;
