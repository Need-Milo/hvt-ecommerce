import { pool } from "../config/db.js";

const selectUser = "SELECT id, full_name AS fullName, email, password_hash AS passwordHash, created_at AS createdAt, updated_at AS updatedAt FROM users";

export const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.execute(`${selectUser} WHERE email = ?`, [email]);
    return rows[0] || null;
  },
  async findById(id) {
    const [rows] = await pool.execute(`${selectUser} WHERE id = ?`, [id]);
    return rows[0] || null;
  },
  async create({ fullName, email, passwordHash }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute("INSERT INTO users (full_name, email, password_hash, updated_at) VALUES (?, ?, ?, NOW(3))", [fullName, email, passwordHash]);
      await connection.execute("INSERT INTO carts (user_id, updated_at) VALUES (?, NOW(3))", [result.insertId]);
      await connection.commit();
      return this.findById(result.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally { connection.release(); }
  },
  async updateFullName(id, fullName) {
    await pool.execute("UPDATE users SET full_name = ?, updated_at = NOW(3) WHERE id = ?", [fullName, id]);
    return this.findById(id);
  },
};
