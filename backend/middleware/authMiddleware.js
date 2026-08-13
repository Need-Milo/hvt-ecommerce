import { UserModel } from "../models/UserModel.js";
import { toPublicUser, verifyToken } from "../utils/auth.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  try {
    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    req.user = toPublicUser(user);
    req.userEntity = user;
    next();
  } catch {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}
