import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
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

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
