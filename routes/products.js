import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const products = [];

router.post("/", protect, adminOnly, (req, res) => {
  const { name, price } = req.body || {};

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price required" });
  }

  const product = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(product);

  res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

router.get("/", (req, res) => {
  res.json(products);
});

export default router;
