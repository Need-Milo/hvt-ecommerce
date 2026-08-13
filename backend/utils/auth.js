import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

export function signToken(user) {
  return jwt.sign(
    { id: String(user.id), email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function toPublicUser(user) {
  return {
    id: Number(user.id),
    fullName: user.fullName,
    name: user.fullName,
    email: user.email,
  };
}
