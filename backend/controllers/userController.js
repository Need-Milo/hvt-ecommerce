import { UserModel } from "../models/UserModel.js";
import { toPublicUser } from "../utils/auth.js";

export const userController = {
  async getMe(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User không tồn tại" });
      }
      return res.json(toPublicUser(user));
    } catch (error) {
      console.error("Get me error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  async updateMe(req, res) {
    try {
      const fullName = (req.body.fullName || req.body.name || "").trim();
      if (!fullName || fullName.length < 2) {
        return res.status(400).json({ message: "Họ và tên không hợp lệ" });
      }

      const user = await UserModel.updateFullName(req.user.id, fullName);
      return res.json(toPublicUser(user));
    } catch (error) {
      console.error("Patch me error:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },
};
