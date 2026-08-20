import "dotenv/config";
import mysql from "mysql2/promise";

const databaseUrl = new URL(process.env.DATABASE_URL);

export const pool = mysql.createPool({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
});

export async function connectDB() {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
  console.log("MySQL connected successfully");
}

export async function disconnectDB() {
  await pool.end();
}
