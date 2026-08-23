export function mapProduct(product) {
  if (!product) return null;

  const images = (product.images || [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => img.imageUrl);

  const specsFromRelation = {};
  for (const row of product.productSpecifications || []) {
    specsFromRelation[row.specificationName] = row.specificationValue;
  }

  const specifications =
    Object.keys(specsFromRelation).length > 0
      ? specsFromRelation
      : product.specifications || {};

  return {
    id: Number(product.id),
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    description: product.description,
    stock: product.stockQuantity,
    stockQuantity: product.stockQuantity,
    specifications,
    isFeatured: product.isFeatured,
    featured: product.isFeatured,
    category: product.category?.name || null,
    categoryId: product.categoryId ? Number(product.categoryId) : null,
    type: product.category?.slug || null,
    status: product.isFeatured ? "hot" : "new",
    image: images,
    images,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function mapCartItem(item) {
  return {
    id: Number(item.id),
    productId: Number(item.productId),
    quantity: item.quantity,
    product: mapProduct(item.product),
  };
}

export function mapOrder(order) {
  return {
    id: Number(order.id),
    orderCode: order.orderCode,
    userId: Number(order.userId),
    receiverName: order.receiverName,
    nameUser: order.receiverName,
    phone: order.phone,
    address: order.shippingAddress,
    shippingAddress: order.shippingAddress,
    totalAmount: Number(order.totalAmount),
    total: Number(order.totalAmount),
    status: order.status,
    createdAt: order.createdAt,
    items: (order.items || []).map((item) => ({
      id: Number(item.id),
      productId: Number(item.productId),
      productName: item.productName,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
      subtotal: Number(item.subtotal),
      product: item.product ? mapProduct(item.product) : undefined,
    })),
  };
}
