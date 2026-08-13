"use client";

import OrderHistoryList from "@/components/OrderHistoryList";
import RequireAuth from "@/components/RequireAuth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchOrders } from "@/lib/redux/orders/ordersThunk";
import { Mail, User } from "lucide-react";
import { useEffect } from "react";

const AccountContent = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) dispatch(fetchOrders(userId));
  }, [userId, dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-shop-dark-green">
          Tài khoản của tôi
        </h1>
        <p className="text-gray-500 mt-1">
          Thông tin cá nhân và lịch sử đặt hàng
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-5 bg-white flex items-start gap-3">
          <User className="w-5 h-5 mt-0.5 text-shop-dark-green" />
          <div>
            <p className="text-sm text-gray-500">Họ và tên</p>
            <p className="font-semibold text-lg">{user?.name}</p>
          </div>
        </div>
        <div className="border rounded-xl p-5 bg-white flex items-start gap-3">
          <Mail className="w-5 h-5 mt-0.5 text-shop-dark-green" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-lg">{user?.email}</p>
          </div>
        </div>
      </div>

      <section id="orders" className="space-y-4">
        <h2 className="text-xl font-semibold">Lịch sử đặt hàng</h2>
        <OrderHistoryList />
      </section>
    </div>
  );
};

const AccountPage = () => (
  <RequireAuth>
    <AccountContent />
  </RequireAuth>
);

export default AccountPage;
