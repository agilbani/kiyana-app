import api from "@/api/api";
import { MasterResponse } from '@/types/master';

export const getCategory = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/master/categories");
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
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
};

export const getMaterial = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/warehouse/materials");
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
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
};

export const getAccessories = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/warehouse/accessories");
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
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
};

export const getColor = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/master/colors");
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
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
};

export const getAllEmployee = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/employees");
    return {
      success: true,
      message: "Success fetch data user",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
};

export const getSewnEmployee = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/employees?roleName=Penjahit");
    return {
      success: true,
      message: "Success fetch data user",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
};

export const getCuttingEmployee = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/employees?roleName=Tukang Potong");
    return {
      success: true,
      message: "Success fetch data user",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
};

export const getListProduct = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/warehouse/products");
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
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
};