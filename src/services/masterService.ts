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

export const getProductBySKU = async (sku: string): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>(`/warehouse/variant-by-sku/${sku}`);
    return {
      success: true,
      message: "Success fetch data produk",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data produk.",
    };
  }
};

export const checkProductionStatus = async (sku: string): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>(`/productions/check-production-status/${sku}`);
    return {
      success: true,
      message: "Success fetch data produk",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data produk.",
    };
  }
};

export const addStock = async (payload: any): Promise<MasterResponse> => {
  try {
    const res = await api.post<MasterResponse>(`/warehouse/increase-stock`, payload);
    return {
      success: true,
      message: "Success add stock produk",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat add stock produk.",
    };
  }
};

export const calculateStock = async (payload: any): Promise<MasterResponse> => {
  try {
    const res = await api.post<MasterResponse>(`/warehouse/calculate-stock`, payload);
    return {
      success: true,
      message: "Success calculate stock produk",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat calculate stock produk.",
    };
  }
};

export const getProductProduction = async (slug: string): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>(`/warehouse/products/${slug}`);
    return {
      success: true,
      message: "Success add stock produk",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat add stock produk.",
    };
  }
};

export const updateStatusFixing = async (payload: any): Promise<MasterResponse> => {
  try {
    const res = await api.post<MasterResponse>(`/productions/approval/update-status`, payload);
    return {
      success: true,
      message: "Success perbaiki status produksi",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat perbaiki status produksi.",
    };
  }
};

export const createPriorityBulk = async (payload: any): Promise<MasterResponse> => {
  try {
    const res = await api.post<MasterResponse>(`/productions/priorities/bulk`, payload);
    return {
      success: true,
      message: "Produksi prioritas berhasil dibuat",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Gagal membuat Produksi prioritas",
    };
  }
};

export const materialRequest = async (payload: any): Promise<MasterResponse> => {
  try {
    const res = await api.post<MasterResponse>(`/warehouse/material-requests`, payload);
    return {
      success: true,
      message: "Permintaan bahan berhasil dikirim",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Gagal mengirimkan permintaan bahan",
    };
  }
};

export const accessoriesRequest = async (payload: any): Promise<MasterResponse> => {
  try {
    const res = await api.post<MasterResponse>(`/warehouse/accessories-requests`, payload);
    return {
      success: true,
      message: "Permintaan aksesoris berhasil dikirim",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Gagal mengirimkan permintaan aksesoris",
    };
  }
};