"use client";

import "../../globals.css";
import { registerThunk } from "@/lib/redux/auth/authThunk";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Logo } from "@/components/Logo";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (name.trim().length < 2) {
      setFormError("Họ và tên phải có ít nhất 2 ký tự");
      return;
    }
    if (password.length < 6) {
      setFormError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Mật khẩu nhập lại không khớp");
      return;
    }

    const result = await dispatch(
      registerThunk({ name: name.trim(), email, password })
    );
    if (registerThunk.fulfilled.match(result)) {
      const message = result.payload.message || "Đăng ký thành công";
      setSuccessMessage(message);
      toast.success(message);
      setTimeout(() => router.push("/login"), 1200);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 bg-shop-dark-green text-white flex-col justify-center px-16">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
          Shopcart
        </p>
        <h1 className="text-4xl font-black mt-4 leading-tight">
          Tạo tài khoản
          <br />
          trong vài giây.
        </h1>
        <p className="mt-4 text-white/80 max-w-md">
          Đăng ký để thêm sản phẩm vào giỏ, thanh toán và xem lịch sử đơn hàng.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-shop-light-bg px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl flex flex-col gap-4"
        >
          <div className="text-center space-y-2">
            <Logo />
            <h1 className="text-xl font-bold">Đăng ký</h1>
          </div>

          <label className="text-sm font-medium">
            Họ và tên
            <input
              placeholder="Nguyễn Văn A"
              className="mt-1 w-full border px-3 py-2.5 rounded-md outline-none focus:border-shop-dark-green"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
              placeholder="Ít nhất 6 ký tự"
              className="mt-1 w-full border px-3 py-2.5 rounded-md outline-none focus:border-shop-dark-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="text-sm font-medium">
            Nhập lại mật khẩu
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="mt-1 w-full border px-3 py-2.5 rounded-md outline-none focus:border-shop-dark-green"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}
          {(formError || error) && (
            <p className="text-red-500 text-sm">{formError || error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-shop-dark-green text-white py-2.5 rounded-md font-semibold disabled:opacity-50 hover:bg-shop-light-green hoverEffect"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-shop-dark-green font-semibold">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
