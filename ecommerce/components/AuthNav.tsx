"use client";

import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";
import LogoutClient from "./LogoutClient";

const AuthNav = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (user) {
    return (
      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/account"
          className="hidden sm:inline text-sm font-semibold hover:text-shop-light-green hoverEffect whitespace-nowrap"
        >
          Tài khoản của tôi
        </Link>
        <LogoutClient />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <Link
        href="/login"
        className="text-sm font-semibold hover:text-shop-light-green hoverEffect whitespace-nowrap"
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className="hidden sm:inline text-sm font-semibold bg-shop-dark-green text-white px-3 py-1.5 rounded-full hover:bg-shop-light-green hoverEffect whitespace-nowrap"
      >
        Đăng ký
      </Link>
    </div>
  );
};

export default AuthNav;
