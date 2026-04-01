import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET || process.env.SESSION_SECRET;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};