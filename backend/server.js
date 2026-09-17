import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB, prisma } from "./config/db.js";
import { seedDatabase } from "./database/seed.js";
import authRouter from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import productsRoute from "./routes/products.js";
import categoriesRoute from "./routes/categories.js";
import cartRoute from "./routes/cart.js";
import ordersRoute from "./routes/orders.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: "mysql", architecture: "mvc" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", ordersRoute);

async function ensureCatalog() {
  const count = await prisma.product.count();
  if (count >= 20) {
    console.log(`Catalog ready: ${count} products`);
    return;
  }

  console.log(`Catalog has ${count} products, seeding to 20+...`);
  await seedDatabase();
}

async function start() {
  await connectDB();
  try {
    await ensureCatalog();
  } catch (error) {
    console.error("Auto-seed failed:", error);
  }
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
