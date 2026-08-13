"use client";

import { loginPath } from "@/lib/auth";
import { useAppSelector } from "@/lib/redux/hooks";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const CartIcon = () => {
  const { items } = useAppSelector((state) => state.carts);
  const user = useAppSelector((state) => state.auth.user);
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  const href = user ? "/cart" : loginPath("/cart");

  return (
    <Link href={href} className="group relative" aria-label="Giỏ hàng">
      <ShoppingBag className="w-5 h-5 hover:text-shop-light-green hoverEffect" />
      <span className="absolute -top-1 -right-1 bg-shop-dark-green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
        {total}
      </span>
    </Link>
  );
};

export default CartIcon;
