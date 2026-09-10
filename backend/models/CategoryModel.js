import { prisma } from "../config/db.js";

export const CategoryModel = {
  findAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
  },
};
