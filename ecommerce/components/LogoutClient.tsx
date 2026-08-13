"use client";

import { logout } from "@/lib/api/authApi";
import { logoutThunk } from "@/lib/redux/auth/authThunk";
import { clearCart } from "@/lib/redux/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const LogoutClient = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // token is cleared locally either way
    }
    dispatch(logoutThunk());
    dispatch(clearCart());
    router.push("/");
    router.refresh();
  };

  if (!user) return null;

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-sm font-semibold hover:text-shop-light-green hoverEffect"
      aria-label="Đăng xuất"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden md:inline">Đăng xuất</span>
    </button>
  );
};

export default LogoutClient;
