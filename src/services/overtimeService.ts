import api from "@/api/api";
import { MasterResponse } from '@/types/master';

export const getMyOvertime = async (): Promise<MasterResponse> => {
  try {
    const res = await api.get<MasterResponse>("/attendances/overtime/my");
    return {
      success: true,
      message: "Success fetch data overtime",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data overtime.",
    };
  }
};