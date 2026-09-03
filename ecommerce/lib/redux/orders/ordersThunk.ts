import { createAsyncThunk } from "@reduxjs/toolkit"
import { createOrderApi, fetchOrderApi } from "../../api/ordersApi"
import { getApiErrorMessage } from "../../api/axiosClient"

export const createOrder = createAsyncThunk(
  "orders/create",
  async (
    { userId, address, phone, nameUser }: { userId: string | number; address: string, phone: string, nameUser: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await createOrderApi(userId, address, phone, nameUser )
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lastOrder", JSON.stringify(res.data))
      }
      return res.data
    } catch (err: any) {
      return rejectWithValue(getApiErrorMessage(err, "Đặt hàng thất bại"))
    }
  }
)
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async(userId: string | number, {rejectWithValue}) => {
    try{
      const res = await fetchOrderApi(userId)
      return res.data
    } catch (err: any) {
      return rejectWithValue(getApiErrorMessage(err, "Không tải được đơn hàng"))
    }
  }
)
