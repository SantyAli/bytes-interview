import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const userOnly = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};
