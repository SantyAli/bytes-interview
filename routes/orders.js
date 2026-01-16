import express from "express";
import { protect, userOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const orders = [];

router.post("/", protect, userOnly, (req, res) => {
  const { items, totalAmount } = req.body || {};

  if (!items || !totalAmount) {
    return res.status(400).json({ message: "Items and totalAmount required" });
  }

  const order = {
    id: orders.length + 1,
    userId: req.user.id,
    items,
    totalAmount,
    createdAt: new Date(),
  };

  orders.push(order);

  res.status(201).json({
    message: "Order created!",
    order,
  });
});

router.get("/", protect, (req, res) => {
  const userOrders = orders.filter((order) => order.userId === req.user.id);

  res.json(userOrders);
});

export default router;
