import api from "../api/api";
import { User } from "../types/auth";

interface LoginResponse {
  status: number;
  user: User;
  token: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  
  const res = await api.post("/login", { email, password });

  return {...res.data, status: res.status};
};

export const getProfile = async (): Promise<any> => {
  try {
    const res = await api.get<any>("/user");
    return {
      success: true,
      message: "Success fetch data loan",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil daftar pinjaman.",
    };
  }
};