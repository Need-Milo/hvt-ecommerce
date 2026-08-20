import { pool } from "../config/db.js";

export const CategoryModel = {
  async findAll() {
    const [rows] = await pool.query("SELECT id, name, slug FROM categories ORDER BY name ASC");
    return rows;
  },
};
