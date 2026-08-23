import { prisma } from "../config/db.js";

export const CategoryModel = {
  findAll() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  },
};
