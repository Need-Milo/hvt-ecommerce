"use client";

import { loginPath } from "@/lib/auth";
import { useAppSelector } from "@/lib/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  requireCart?: boolean;
}

const RequireAuth = ({ children, requireCart = false }: Props) => {
  const { user, authChecked } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.carts.items);
  const cartLoading = useAppSelector((state) => state.carts.loading);
  const cartHydrated = useAppSelector((state) => state.carts.hydrated);
  const cartError = useAppSelector((state) => state.carts.error);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authChecked) return;
    if (!user) {
      router.replace(loginPath(pathname));
    }
  }, [authChecked, user, pathname, router]);

  useEffect(() => {
    if (!requireCart || !authChecked || !user || cartLoading || !cartHydrated) {
      return;
    }
    if (cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [
    requireCart,
    authChecked,
    user,
    cartLoading,
    cartHydrated,
    cartItems.length,
    router,
  ]);

  if (!authChecked || !user) {
    return (
      <div className="py-24 text-center text-gray-500">Đang tải...</div>
    );
  }

  if (requireCart && cartError && !cartHydrated) {
    return (
      <div className="py-24 text-center text-red-500">
        Không tải được giỏ hàng. Kiểm tra backend đang chạy rồi F5 lại.
      </div>
    );
  }

  if (requireCart && (cartLoading || !cartHydrated)) {
    return (
      <div className="py-24 text-center text-gray-500">
        Đang tải giỏ hàng...
      </div>
    );
  }

  if (requireCart && cartItems.length === 0) {
    return (
      <div className="py-24 text-center text-gray-500">
        Giỏ hàng đang trống...
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
