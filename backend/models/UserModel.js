import { prisma } from "../config/db.js";

export const UserModel = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id) {
    return prisma.user.findUnique({ where: { id: BigInt(id) } });
  },

  create({ fullName, email, passwordHash }) {
    return prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        cart: { create: {} },
      },
    });
  },

  updateFullName(id, fullName) {
    return prisma.user.update({
      where: { id: BigInt(id) },
      data: { fullName },
    });
  },
};
