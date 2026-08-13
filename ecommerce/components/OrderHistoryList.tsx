"use client";

import PriceFormatter from "@/components/PriceFormatter";
import { orderStatusLabel } from "@/lib/auth";
import { useAppSelector } from "@/lib/redux/hooks";

const OrderHistoryList = () => {
  const orders = useAppSelector((state) => state.orders.orders);
  const loading = useAppSelector((state) => state.orders.loading);

  if (loading) {
    return <p className="text-gray-500 py-6">Đang tải đơn hàng...</p>;
  }

  if (!orders.length) {
    return (
      <p className="text-gray-500 py-6">
        Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn đầu tiên.
      </p>
    );
  }

  return (
    <ul className="border rounded-lg overflow-hidden">
      <li className="hidden md:grid grid-cols-4 border-b text-center font-bold py-3 bg-gray-100">
        <span>Mã đơn hàng</span>
        <span>Ngày đặt</span>
        <span>Tổng tiền</span>
        <span>Trạng thái</span>
      </li>
      {orders.map((order) => (
        <li
          key={order.id}
          className="border-b p-4 last:border-b-0 flex flex-col gap-2 md:grid md:grid-cols-4 md:text-center md:items-center"
        >
          <div className="md:hidden space-y-1 text-sm">
            <p>
              <strong>Mã đơn:</strong> {order.id}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              <PriceFormatter amount={order.total} />
            </p>
            <p>
              <strong>Trạng thái:</strong> {orderStatusLabel(order.status)}
            </p>
          </div>
          <span className="hidden md:block break-all">{order.id}</span>
          <span className="hidden md:block">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </span>
          <span className="hidden md:block">
            <PriceFormatter amount={order.total} />
          </span>
          <span className="hidden md:block text-shop-dark-green font-medium">
            {orderStatusLabel(order.status)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default OrderHistoryList;
