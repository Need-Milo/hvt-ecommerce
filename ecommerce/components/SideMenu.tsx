"use client";

import { FC } from "react";
import { Logo } from "./Logo";
import { X } from "lucide-react";
import { headerData } from "../constants/data";
import Link from "next/link";
import SocialMedia from "./SocialMedia";
import { usePathname } from "next/navigation";
import useOutsideClick from "@/hooks";
import { useAppSelector } from "@/lib/redux/hooks";
import { loginPath } from "@/lib/auth";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SideBarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const user = useAppSelector((state) => state.auth.user);

  const authLinks = user
    ? [
        { title: "Tài khoản của tôi", href: "/account" },
        { title: "Giỏ hàng", href: "/cart" },
      ]
    : [
        { title: "Đăng nhập", href: loginPath(pathname) },
        { title: "Đăng ký", href: "/register" },
      ];

  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/80 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hoverEffect`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-shop-light-green flex flex-col gap-6"
      >
        <div className="flex items-center justify-between gap-5">
          <Logo
            className="text-white"
            spanDesign=" text-shop-light-green group-hover:text-white "
          />
          <button
            onClick={onClose}
            className="hover:text-shop-light-green hoverEffect"
          >
            <X />
          </button>
        </div>

        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {[...headerData, ...authLinks].map((item) => (
            <Link
              href={item.href}
              key={item.title}
              onClick={onClose}
              className={`hover:text-shop-light-green hoverEffect ${
                pathname === item.href ? "text-shop-light-green" : ""
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <SocialMedia />
      </div>
    </div>
  );
};

export default SideMenu;
