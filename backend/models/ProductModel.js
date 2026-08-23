import { prisma } from "../config/db.js";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
  productSpecifications: { orderBy: { sortOrder: "asc" } },
};

function parseSort(sort) {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "name_asc":
    case "name_az":
      return { name: "asc" };
    case "name_desc":
    case "name_za":
      return { name: "desc" };
    default:
      return { id: "asc" };
  }
}

export const ProductModel = {
  async findMany(query = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const search = (query.search || "").trim();
    const category = (query.category || "").trim();
    const minPrice = query.minPrice != null ? Number(query.minPrice) : null;
    const maxPrice = query.maxPrice != null ? Number(query.maxPrice) : null;

    const where = {};
    if (search) where.name = { contains: search };
    if (category) {
      where.OR = [
        { category: { slug: category } },
        { category: { name: category } },
      ];
      if (!Number.isNaN(Number(category))) {
        where.OR.push({ categoryId: BigInt(category) });
      }
    }
    if (minPrice != null && !Number.isNaN(minPrice)) {
      where.price = { ...(where.price || {}), gte: minPrice };
    }
    if (maxPrice != null && !Number.isNaN(maxPrice)) {
      where.price = { ...(where.price || {}), lte: maxPrice };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: parseSort(query.sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  findFeatured(take = 12) {
    return prisma.product.findMany({
      where: { isFeatured: true },
      include: productInclude,
      orderBy: { id: "asc" },
      take,
    });
  },

  findById(id) {
    return prisma.product.findUnique({
      where: { id: BigInt(id) },
      include: productInclude,
    });
  },

  findRelated(productId, categoryId, take = 8) {
    return prisma.product.findMany({
      where: {
        categoryId: BigInt(categoryId),
        NOT: { id: BigInt(productId) },
      },
      include: productInclude,
      take,
      orderBy: { id: "asc" },
    });
  },
};
