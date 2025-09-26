import api from "@/api/api";
import { ApiResponse, Payout } from '@/types/payout';

export const getPayouts = async (): Promise<ApiResponse<Payout[]>> => {
  try {
    const res = await api.get("/payouts");
    return {
      success: true,
      statusCode: res.status,
      data: res.data as Payout[],
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: error.response?.status || 500,
      data: [] as Payout[], // fallback empty array
    };
  }
};

export const postPayout = async (payload: {
  number: string;
  employee_id: any;
  date: string;
  nominal: number;
}): Promise<ApiResponse<Payout>> => {
  console.log('payload post', payload);
  
  try {
    const response = await api.post(`/payouts`, payload);
    console.log('res payout', response);
    
    return {
      success: true,
      statusCode: response.status,
      data: response.data as Payout,
    };
  } catch (error: any) {
    console.log('error payout', error.response);
    return {
      success: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data.message,
      data: {} as Payout,
    };
  }
};