import api from "@/api/api";
import { MasterResponse } from "@/types/master";
import { Task } from '@/types/task';
import { queryParams } from "@/utils/getQueryParams";

export interface StartProcessResponse {
  success: boolean;
  statusCode: number;
  message?: string | any;
}

export interface GetTaskByIdResult {
  success: boolean;
  statusCode: number;
  message: string;
  data?: Task; // only available if success
}

/**
 * Get all tasks by date and status
 * @param status Planned/Completed/etc.
 * @param start_date YYYY-MM-DD
 * @param end_date YYYY-MM-DD
 */
export async function getTasksByDate(
  start_date: string,
  end_date: string,
  status: string,
  url: string
): Promise<MasterResponse> {
   console.log('priority', start_date);
   console.log('priority 1', end_date);
   console.log('priority 2', status);
   
//   const response = await api.get<ListTask[]>(
//     `/${url}?start_date=${start_date}&end_date=${end_date}&status=${status}`
//   );
//   return response.data;
   try {
      const res = await api.get<MasterResponse>(`/${url}?start_date=${start_date}&end_date=${end_date}&status=${status}`);
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
}

export async function getListProduction(params?: any): Promise<Task[]> {
   console.log('params get prod', `/productions?${queryParams(params)}`);
   
  const response = await api.get(
    `/productions?${queryParams(params)}`,
  );
  console.log('res prod', response);
  
  return response.data;
}

export async function startProcess(
  codePlan: string | any,
  productionItemId: number | any,
  params: any
): Promise<StartProcessResponse> {
  try {
    const response = await api.post(
      `/productions/plans/${codePlan}/start/${productionItemId}`, params
    );

    // success case
    return {
      success: true,
      statusCode: response.status,
      message: response.data?.message ?? "Process started successfully",
    };
  } catch (error: any) {
    // handle axios error
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message ?? "Failed to start process",
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        statusCode: 0,
        message: "No response from server",
      };
    } else {
      // Something else happened
      return {
        success: false,
        statusCode: 0,
        message: error.message || "Unexpected error",
      };
    }
  }
}

export async function getTaskById(id: string): Promise<GetTaskByIdResult> {
  try {
    const response = await api.get<Task>(`/productions/plans/${id}`);
    return {
      success: true,
      statusCode: response.status,
      message: "Task fetched successfully",
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to fetch task",
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