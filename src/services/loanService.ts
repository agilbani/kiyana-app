import api from "@/api/api";
import { CreateLoanPayload, CreateLoanResponse, GetMyLoansResponse } from '@/types/loan';

export const createLoan = async (
  payload: CreateLoanPayload
): Promise<CreateLoanResponse> => {
  try {
    // Use your pre-configured axios instance
    const response = await api.post<CreateLoanResponse>("/loans", payload);

    // Response should return { success: boolean, message: string }
    return {
      success: true,
      message: 'Peminjaman anda berhasil dibuat',
    };
  } catch (error: any) {
    // gracefully handle error response
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Terjadi kesalahan saat mengajukan pinjaman.",
    };
  }
};

export const getMyLoans = async (): Promise<GetMyLoansResponse> => {
  try {
    const res = await api.get<GetMyLoansResponse>("/loans/my");
    // return res; // directly return the response shape
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