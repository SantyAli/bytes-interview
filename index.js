import express from "express";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
