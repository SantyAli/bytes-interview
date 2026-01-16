import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { addToQueue } from "../queue/loginQueue.js";

const router = express.Router();

const users = [];

router.post("/register", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const userRole = email.split("@");
  const newUser = {
    id: users.length + 1,
    email,
    role: userRole[0],
  };

  users.push({
    ...newUser,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
});

router.post("/login", (req, res) => {
  addToQueue(async () => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatched = bcrypt.compareSync(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "secret_key",
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

router.post("/forgot-password", (req, res) => {
  const { email, newPassword } = req.body || {};

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = bcrypt.hashSync(newPassword, 10);

  res.json({
    message: "Password reset successful",
  });
});

export default router;
