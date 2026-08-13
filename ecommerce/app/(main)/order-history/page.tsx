"use client";

import OrderHistoryList from "@/components/OrderHistoryList";
import RequireAuth from "@/components/RequireAuth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchOrders } from "@/lib/redux/orders/ordersThunk";
import { useEffect } from "react";

const OrderHistoryContent = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) dispatch(fetchOrders(userId));
  }, [userId, dispatch]);

  return (
    <div className="px-4 md:px-10 lg:px-20 mb-10">
      <h2 className="text-center font-semibold text-2xl md:text-3xl my-6 text-shop-dark-green">
        Lịch sử đơn hàng
      </h2>
      <OrderHistoryList />
    </div>
  );
};

const OrderHistory = () => (
  <RequireAuth>
    <OrderHistoryContent />
  </RequireAuth>
);

export default OrderHistory;
