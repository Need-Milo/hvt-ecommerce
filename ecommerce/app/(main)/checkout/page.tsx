"use client";

import PriceFormatter from "@/components/PriceFormatter";
import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { clearCart } from "@/lib/redux/carts/cartsSlice";
import { fetchCart } from "@/lib/redux/carts/cartsThunk";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createOrder } from "@/lib/redux/orders/ordersThunk";
import { fetchProducts } from "@/lib/redux/products/productsThunk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CheckOutContent = () => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [nameUser, setNameUser] = useState("");
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const userId = user?.id || user?._id;
  const cartItems = useAppSelector((state) => state.carts.items);
  const dispatch = useAppDispatch();

  const subTotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (userId) dispatch(fetchCart(userId));
  }, [userId, dispatch]);

  useEffect(() => {
    if (user?.name && !nameUser) setNameUser(user.name);
  }, [user, nameUser]);

  const handleOrder = async (e: FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    if (!nameUser.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }

    try {
      await dispatch(
        createOrder({ userId, address, phone, nameUser })
      ).unwrap();
      dispatch(clearCart());
      await dispatch(fetchProducts());
      toast.success("Đặt hàng thành công");
      router.push("/order-success");
    } catch {
      toast.error("Đặt hàng thất bại");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <form
        onSubmit={handleOrder}
        className="p-6 md:p-8 space-y-4 border rounded-xl shadow-sm bg-white"
      >
        <h1 className="text-xl font-bold">Thông tin giao hàng</h1>

        <label className="block text-sm font-medium">
          Họ tên
          <input
            className="mt-1 w-full border p-2.5 rounded-md outline-none focus:border-shop-dark-green"
            value={nameUser}
            onChange={(e) => setNameUser(e.target.value)}
            placeholder="Nguyễn Văn A"
            type="text"
            required
          />
        </label>

        <label className="block text-sm font-medium">
          Số điện thoại
          <input
            className="mt-1 w-full border p-2.5 rounded-md outline-none focus:border-shop-dark-green"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0912345678"
            type="tel"
            required
            pattern="^0[0-9]{9}$"
          />
        </label>

        <label className="block text-sm font-medium">
          Địa chỉ
          <input
            className="mt-1 w-full border p-2.5 rounded-md outline-none focus:border-shop-dark-green"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
            type="text"
            required
          />
        </label>

        <Button type="submit" className="w-full h-11 font-semibold">
          Xác nhận
        </Button>
      </form>

      <div className="border rounded-xl p-6 space-y-4 bg-white shadow-sm h-fit">
        <h2 className="font-semibold text-lg">Tóm tắt đơn hàng</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              {item.product?.image && (
                <div className="w-12 h-12 relative rounded overflow-hidden border">
                  <Image
                    src={item.product.image[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex flex-col text-sm">
                <span className="font-medium line-clamp-1">
                  {item.product?.name}
                </span>
                <span className="text-gray-500">
                  {item.quantity} x{" "}
                  <PriceFormatter amount={item.product?.price || 0} />
                </span>
              </div>
            </div>
            <PriceFormatter
              amount={(item.product?.price || 0) * item.quantity}
              className="font-medium text-sm"
            />
          </div>
        ))}
        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Tổng tiền</span>
          <PriceFormatter amount={subTotal} className="text-xl" />
        </div>
      </div>
    </div>
  );
};

const CheckOutPage = () => (
  <RequireAuth requireCart>
    <CheckOutContent />
  </RequireAuth>
);

export default CheckOutPage;
