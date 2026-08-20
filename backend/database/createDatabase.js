import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseDbUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
  };
}

async function createDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Thiếu DATABASE_URL trong file .env");
  }

  const cfg = parseDbUrl(databaseUrl);
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  console.log(`Connecting MySQL ${cfg.host}:${cfg.port} as ${cfg.user}...`);

  const connection = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log(`Database "${cfg.database}" created / tables synced from schema.sql`);
  } finally {
    await connection.end();
  }
}

createDatabase()
  .then(() => {
    console.log("Done. Next: npm run db:seed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Create database failed:", error.message);
    process.exit(1);
  });
