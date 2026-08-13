import { prisma } from "../config/db.js";

const itemInclude = {
  product: {
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  },
};

export const CartModel = {
  async getOrCreateByUserId(userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId: BigInt(userId) },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: BigInt(userId) },
      });
    }
    return cart;
  },

  async getItemsByUserId(userId) {
    const cart = await this.getOrCreateByUserId(userId);
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: itemInclude,
      orderBy: { id: "asc" },
    });
    return { cart, items };
  },

  findItem(cartId, productId) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId: BigInt(productId),
        },
      },
    });
  },

  findItemInCart(itemId, cartId) {
    return prisma.cartItem.findFirst({
      where: { id: BigInt(itemId), cartId },
      include: { product: true },
    });
  },

  createItem(cartId, productId, quantity) {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId: BigInt(productId),
        quantity,
      },
      include: itemInclude,
    });
  },

  updateItemQuantity(itemId, quantity) {
    return prisma.cartItem.update({
      where: { id: BigInt(itemId) },
      data: { quantity },
      include: itemInclude,
    });
  },

  deleteItem(itemId) {
    return prisma.cartItem.delete({ where: { id: BigInt(itemId) } });
  },

  clearItems(cartId) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  },
};
