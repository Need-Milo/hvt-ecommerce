"use client";

import { getMeThunk } from "@/lib/redux/auth/authThunk";
import { markAuthChecked } from "@/lib/redux/auth/authSlice";
import { clearCart } from "@/lib/redux/carts/cartsSlice";
import { fetchCart } from "@/lib/redux/carts/cartsThunk";
import { fetchProducts } from "@/lib/redux/products/productsThunk";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";

const AuthBootsTrap = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getMeThunk());
    } else {
      dispatch(markAuthChecked());
    }
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (userId) {
      dispatch(fetchCart(userId));
    } else {
      dispatch(clearCart());
    }
  }, [dispatch, user]);

  return null;
};

export default AuthBootsTrap;
