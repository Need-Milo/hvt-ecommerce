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
  const userId = useAppSelector(
    (state) => state.auth.user?.id || state.auth.user?._id || null
  );

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
    if (userId) {
      dispatch(fetchCart(userId));
    } else {
      dispatch(clearCart());
    }
  }, [dispatch, userId]);

  return null;
};

export default AuthBootsTrap;
