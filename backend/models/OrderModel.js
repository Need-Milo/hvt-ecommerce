import { prisma } from "../config/db.js";

const orderInclude = {
  items: {
    include: {
      product: {
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  },
};

export const OrderModel = {
  findByUserId(userId) {
    return prisma.order.findMany({
      where: { userId: BigInt(userId) },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.order.findUnique({
      where: { id: BigInt(id) },
      include: orderInclude,
    });
  },

  async checkout({
    userId,
    receiverName,
    phone,
    address,
    cart,
    cartItems,
  }) {
    return prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const lineItems = [];

      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw Object.assign(new Error("Sản phẩm không tồn tại"), {
            status: 400,
          });
        }
        if (product.stockQuantity < item.quantity) {
          throw Object.assign(
            new Error(`Not enough stock for ${product.name}`),
            { status: 400 }
          );
        }

        const unitPrice = Number(product.price);
        const subtotal = unitPrice * item.quantity;
        totalAmount += subtotal;

        lineItems.push({
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity: item.quantity,
          subtotal,
        });
      }

      const created = await tx.order.create({
        data: {
          orderCode: `TEMP-${Date.now()}`,
          userId: BigInt(userId),
          receiverName,
          phone,
          shippingAddress: address,
          totalAmount,
          status: "PENDING",
          items: { create: lineItems },
        },
      });

      await tx.order.update({
        where: { id: created.id },
        data: { orderCode: `ORD-${created.id}` },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return tx.order.findUnique({
        where: { id: created.id },
        include: orderInclude,
      });
    });
  },
};
