"use client";

import PriceFormatter from "@/components/PriceFormatter";
import RequireAuth from "@/components/RequireAuth";
import { orderStatusLabel } from "@/lib/auth";
import { useAppSelector } from "@/lib/redux/hooks";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const OrderSuccessContent = () => {
  const reduxOrder = useAppSelector((state) => state.orders.currentOrder);
  const [order, setOrder] = useState(reduxOrder);

  useEffect(() => {
    if (reduxOrder) {
      setOrder(reduxOrder);
      return;
    }
    const raw = sessionStorage.getItem("lastOrder");
    if (raw) setOrder(JSON.parse(raw));
  }, [reduxOrder]);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Không tìm thấy đơn hàng</p>
        <Link href="/shop" className="text-shop-dark-green font-semibold underline">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 md:p-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-shop-dark-green">
            Đặt hàng thành công
          </h1>
          <p className="text-sm text-gray-500">
            Cảm ơn bạn. Đơn hàng đã được ghi nhận vào tài khoản.
          </p>
        </div>

        <div className="border rounded-lg divide-y text-sm md:text-base">
          <div className="flex justify-between p-4">
            <span className="text-gray-500">Mã đơn hàng</span>
            <span className="font-medium">{order.id}</span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-gray-500">Người nhận</span>
            <span className="font-medium">{order.nameUser}</span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-gray-500">Số điện thoại</span>
            <span>{order.phone}</span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-gray-500">Địa chỉ</span>
            <span className="text-right max-w-[60%]">{order.address}</span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-gray-500">Trạng thái</span>
            <span className="text-shop-dark-green font-medium">
              {orderStatusLabel(order.status)}
            </span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-gray-500">Ngày đặt</span>
            <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
          </div>
        </div>

        {order.items?.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold">Sản phẩm đã đặt</h2>
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.product?.image?.[0] && (
                    <Image
                      src={item.product.image[0]}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      unoptimized
                      className="rounded border object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">x {item.quantity}</p>
                  </div>
                </div>
                <PriceFormatter
                  amount={(item.product?.price || 0) * item.quantity}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between border-t pt-4 font-semibold">
          <span>Tổng tiền</span>
          <PriceFormatter amount={order.total} className="text-lg" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/account"
            className="flex-1 text-center bg-shop-btn-dark-green text-white px-6 py-2.5 rounded-md hover:bg-gray-800 transition"
          >
            Xem lịch sử đơn hàng
          </Link>
          <Link
            href="/shop"
            className="flex-1 text-center border border-shop-dark-green text-shop-dark-green px-6 py-2.5 rounded-md hover:bg-shop-dark-green hover:text-white transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

const OrderSuccess = () => (
  <RequireAuth>
    <OrderSuccessContent />
  </RequireAuth>
);

export default OrderSuccess;
