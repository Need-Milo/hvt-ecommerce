import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import productsRoute from "./routes/products.js";
import cartsRoute from "./routes/carts.js";
import ordersRoute from "./routes/orders.js"
import cookieParser from "cookie-parser";
import path from "path"
import { fileURLToPath } from "url";


const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


app.use(cookieParser())
app.use(cors({
  origin: true,
  credentials: true
}));
app.use("/images", 
  express.static(path.join(__dirname, "images"))
 );
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", usersRoute);
app.use("/products", productsRoute);
app.use("/carts", cartsRoute);
app.use("/orders", ordersRoute);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
