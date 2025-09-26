import api from "@/api/api";
import { ApiResponse } from '@/types/productVariant';
import { queryParams } from "@/utils/getQueryParams";
import { Result } from "./productionService";

export async function getProductVariant(): Promise<ApiResponse> {
   try {
    const res = await api.get("/warehouse/product-variants");
    return {
      success: true,
      statusCode: 200,
      message: "Success fetch data loan",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 400,
      data: [],
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
}

export async function getDetailProductVariant(id: string): Promise<ApiResponse> {
   try {
    const res = await api.get(`/warehouse/product-variants/${id}`);
    return {
      success: true,
      statusCode: 200,
      message: "Success fetch detail variant",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 400,
      data: [],
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
}

export async function getProductionItems(params: any): Promise<ApiResponse> {
   try {
    const res = await api.get(`/productions/production-items?${queryParams(params)}`);
    return {
      success: true,
      statusCode: 200,
      message: "Success fetch detail variant",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 400,
      data: [],
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
}

export async function updateStockVariant(payload: any, id: any): Promise<Result> {
  
  try {
    const response = await api.post(`/warehouse/product-variants/${id}/stock-opname`, payload);
    return {
      success: true,
      statusCode: response.status,
      message: "update stock successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response);
    
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to update stock",
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        statusCode: 0,
        message: "No response from server",
      };
    } else {
      // Something unexpected happened
      return {
        success: false,
        statusCode: 0,
        message: error.message || "Unexpected error",
      };
    }
  }
}