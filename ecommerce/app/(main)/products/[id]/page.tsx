"use client";

import { StarIcon } from "lucide-react";
import Image from "next/image";
import ImageView from "../../../../components/ImageView";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ConTainer from "../../../../components/Container";
import { useAppDispatch, useAppSelector } from "../../../../lib/redux/hooks";
import { fetchProducts } from "@/lib/redux/products/productsThunk";
import { AddToCartButton } from "../../../../components/AddToCartButton";
import Link from "next/link";
import PriceFormatter from "@/components/PriceFormatter";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const params = useParams();
  const id = Number(params?.id);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.products);
  const cartItems = useAppSelector((state) => state.carts.items);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const product = items.find((p) => p.id === id);
  const warehouseStock = product?.stock ?? 0;
  const cartQty =
    cartItems.find((item) => item.productId === product?.id)?.quantity || 0;

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (warehouseStock > 0) {
      setQuantity((q) => Math.min(q, warehouseStock));
    }
  }, [warehouseStock]);

  if (loading || !product) {
    return (
      <ConTainer className="py-20 text-center">
        <p className="text-gray-500">Đang tải sản phẩm...</p>
      </ConTainer>
    );
  }

  const isStock = warehouseStock > 0;
  const canIncrease = quantity < warehouseStock;
  const relatedProducts = items
    .filter((p) => p.type === product.type && p.id !== product.id)
    .slice(0, 8);
  const specs = product.specifications || {
    "Danh mục": product.type,
    "Mã sản phẩm": String(product.id),
    "Tình trạng": isStock ? "Còn hàng" : "Hết hàng",
    "Bảo hành": "12 tháng",
  };

  return (
    <>
      <ConTainer className="flex flex-col md:flex-row gap-10 py-10">
        {product.image?.length > 0 && (
          <ImageView images={product.image} isStock={isStock} />
        )}

        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-sm text-gray-600 tracking-wide">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-shop-light-green"
                fill="#3b9c3c"
              />
            ))}
            <p className="font-semibold">(120 đánh giá)</p>
          </div>

          <div className="space-y-3 border-y border-gray-200 py-5">
            <PriceFormatter
              amount={product.price}
              className="text-2xl font-bold"
            />
            <span
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg inline-block ${
                isStock
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isStock ? `Còn ${warehouseStock} sản phẩm` : "Hết hàng"}
            </span>
            {isStock && cartQty > 0 && (
              <p className="text-sm text-gray-600">
                Đã có {cartQty} sản phẩm trong giỏ — tồn kho chỉ trừ khi thanh
                toán
              </p>
            )}
          </div>

          {isStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Số lượng</span>
              <div className="flex items-center border rounded-md">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  disabled={!canIncrease}
                  onClick={() =>
                    setQuantity((q) => Math.min(warehouseStock, q + 1))
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {!canIncrease && (
                <span className="text-xs text-gray-500">
                  Đã chọn tối đa {warehouseStock} sản phẩm
                </span>
              )}
            </div>
          )}

          <AddToCartButton
            product={product}
            quantity={quantity}
            forceButton
            className="rounded-md h-11"
          />

          <div className="border rounded-lg overflow-hidden">
            <h3 className="font-semibold px-4 py-3 bg-gray-50 border-b">
              Thông số kỹ thuật
            </h3>
            <dl>
              {Object.entries(specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-4 px-4 py-2.5 text-sm border-b last:border-b-0"
                >
                  <dt className="text-gray-500">{key}</dt>
                  <dd className="font-medium text-right capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </ConTainer>

      {relatedProducts.length > 0 && (
        <ConTainer className="pb-16">
          <h3 className="text-xl font-bold mb-6">Sản phẩm liên quan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="border rounded-lg p-3 hover:shadow-md transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image[0]}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-contain group-hover:opacity-0 transition duration-300"
                  />
                  {item.image[1] && (
                    <Image
                      src={item.image[1]}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-contain opacity-0 group-hover:opacity-100 transition duration-300"
                    />
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <PriceFormatter
                    amount={item.price}
                    className="text-shop-dark-green font-bold"
                  />
                </div>
              </Link>
            ))}
          </div>
        </ConTainer>
      )}
    </>
  );
}
