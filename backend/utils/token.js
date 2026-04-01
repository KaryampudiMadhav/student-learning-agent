import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || process.env.SESSION_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT secret is not configured. Set JWT_SECRET or SESSION_SECRET.");
  }

  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: "7d"
  });
};