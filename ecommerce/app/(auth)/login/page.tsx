"use client";

import "../../globals.css";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginThunk } from "@/lib/redux/auth/authThunk";
import { clearAuthError } from "@/lib/redux/auth/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { clearCart } from "@/lib/redux/carts/cartsSlice";
import { fetchCart } from "@/lib/redux/carts/cartsThunk";
import { getSafeRedirect } from "@/lib/auth";
import { Logo } from "@/components/Logo";

function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirectTo = getSafeRedirect(searchParams.get("redirect"));

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
  };

  useEffect(() => {
    if (user) {
      const userId = user.id || user._id;
      dispatch(clearCart());
      dispatch(fetchCart(userId));
      router.push(redirectTo);
    }
  }, [user, router, dispatch, redirectTo]);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 bg-shop-dark-green text-white flex-col justify-center px-16">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
          Shopcart
        </p>
        <h1 className="text-4xl font-black mt-4 leading-tight">
          Mua sắm dễ dàng,
          <br />
          giao hàng tận nơi.
        </h1>
        <p className="mt-4 text-white/80 max-w-md">
          Đăng nhập để quản lý giỏ hàng, theo dõi đơn hàng và hoàn tất thanh
          toán.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-shop-light-bg px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl flex flex-col gap-4"
        >
          <div className="text-center space-y-2">
            <Logo />
            <h1 className="text-xl font-bold">Đăng nhập</h1>
            <p className="text-sm text-gray-500">
              Nhập email và mật khẩu để tiếp tục
            </p>
          </div>

          <label className="text-sm font-medium">
            Email
            <input
              type="email"
              placeholder="you@email.com"
              className="mt-1 w-full border px-3 py-2.5 rounded-md outline-none focus:border-shop-dark-green"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="text-sm font-medium">
            Mật khẩu
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full border px-3 py-2.5 rounded-md outline-none focus:border-shop-dark-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-shop-dark-green text-white py-2.5 rounded-md font-semibold disabled:opacity-50 hover:bg-shop-light-green hoverEffect"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-shop-dark-green font-semibold">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
