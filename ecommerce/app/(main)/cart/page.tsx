"use client";

import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButton from "@/components/QuantityButton";
import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/text";
import { fetchCart, removeAllFromCart } from "@/lib/redux/carts/cartsThunk";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const CartContent = () => {
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.carts.items);
  const userId = user?.id || user?._id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const subTotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [userId, dispatch]);

  const handleBuy = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }
    router.push("/checkout");
  };

  return (
    <Container>
      <div className="flex items-center gap-2 py-5">
        <ShoppingBag className="text-darkColor" />
        <Title>Giỏ hàng</Title>
      </div>

      <div className="grid lg:grid-cols-3 md:gap-8 pb-32 md:pb-0">
        <div className="lg:col-span-2 rounded-lg">
          <div className="border bg-white rounded-md">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
                <Link
                  href="/shop"
                  className="inline-block text-shop-dark-green font-semibold underline"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id || item._id}
                  className="border-b p-3 last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex flex-1 items-start gap-3">
                    {item.product?.image && (
                      <Link
                        href={`/products/${item.product.id}`}
                        className="border p-1 rounded-md overflow-hidden group shrink-0"
                      >
                        <Image
                          src={item.product.image[0]}
                          alt={item.product.name}
                          width={500}
                          height={500}
                          loading="lazy"
                          unoptimized
                          className="w-24 h-24 md:w-32 md:h-32 object-cover group-hover:scale-105 hoverEffect"
                        />
                      </Link>
                    )}
                    <div className="flex-1 space-y-1">
                      <h2 className="text-base font-semibold line-clamp-1">
                        {item.product?.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Đơn giá:{" "}
                        <PriceFormatter amount={item.product?.price || 0} />
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.product?.stock > 0
                          ? `Còn ${item.product.stock} sản phẩm`
                          : "Hết hàng"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Thành tiền:{" "}
                        <PriceFormatter
                          amount={
                            (item.product?.price || 0) * (item.quantity || 0)
                          }
                          className="font-bold"
                        />
                      </p>
                      <button
                        onClick={() => {
                          dispatch(
                            removeAllFromCart({ userId, itemId: item.id })
                          )
                            .unwrap()
                            .then(() => toast.success("Đã xóa khỏi giỏ hàng"))
                            .catch(() => toast.error("Không thể xóa sản phẩm"));
                        }}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 hoverEffect"
                      >
                        <Trash className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  </div>
                  <QuantityButton
                    userId={userId}
                    itemId={item.id}
                    productId={item.product.id}
                    quantity={item.quantity}
                    product={item.product}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="hidden md:block w-full bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <PriceFormatter amount={subTotal} />
              </div>
              <div className="font-semibold text-lg flex items-center justify-between border-t pt-4">
                <span>Tổng tiền</span>
                <PriceFormatter
                  amount={subTotal}
                  className="text-lg font-bold text-black"
                />
              </div>
              <Button
                onClick={handleBuy}
                disabled={cartItems.length === 0}
                className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                size="lg"
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Tổng tiền</span>
              <PriceFormatter
                amount={subTotal}
                className="text-lg font-bold text-black"
              />
            </div>
            <Button
              onClick={handleBuy}
              disabled={cartItems.length === 0}
              className="rounded-full font-semibold px-8"
              size="lg"
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

const CartPage = () => (
  <RequireAuth>
    <CartContent />
  </RequireAuth>
);

export default CartPage;
