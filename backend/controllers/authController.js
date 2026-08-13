import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel.js";
import { signToken, toPublicUser } from "../utils/auth.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authController = {
  async register(req, res) {
    try {
      const fullName = (req.body.fullName || req.body.name || "").trim();
      const email = (req.body.email || "").trim().toLowerCase();
      const password = req.body.password || "";
      const confirmPassword = req.body.confirmPassword;

      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Thiếu trường bắt buộc" });
      }
      if (fullName.length < 2) {
        return res.status(400).json({ message: "Họ và tên phải có ít nhất 2 ký tự" });
      }
      if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
      }
      if (confirmPassword !== undefined && password !== confirmPassword) {
        return res.status(400).json({ message: "Mật khẩu nhập lại không khớp" });
      }

      const exists = await UserModel.findByEmail(email);
      if (exists) {
        return res.status(409).json({ message: "Email đã tồn tại" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ fullName, email, passwordHash });

      return res.status(201).json({
        message: "Đăng ký thành công",
        user: toPublicUser(user),
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  async login(req, res) {
    try {
      const email = (req.body.email || "").trim().toLowerCase();
      const password = req.body.password || "";

      if (!email || !password) {
        return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
      }

      return res.json({
        token: signToken(user),
        user: toPublicUser(user),
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  me(req, res) {
    return res.json({ user: req.user });
  },

  logout(_req, res) {
    return res.json({ message: "Đã đăng xuất" });
  },
};
