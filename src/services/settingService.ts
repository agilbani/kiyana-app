import api from '@/api/api';
import { Setting } from '@/types/settings';

export interface GetSettingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: Setting[];
}

export const getAllSettings = async (): Promise<GetSettingsResponse> => {
  try {
    const res = await api.get<Setting[]>("/settings"); // adjust endpoint if needed
    return {
      success: true,
      statusCode: res.status,
      message: "Settings fetched successfully",
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      statusCode: err.response?.status ?? 500,
      message: err.response?.data?.message ?? "Failed to fetch settings",
    };
  }
};