import api from "@/api/api";
import { EntryProductionPayload, Production, RejectProductionPayload, UpdateProductionResponse } from '@/types/production';
import { ApiResponse, Product } from "@/types/warehouse";

export interface GetTaskByBatchResult {
  success: boolean;
  statusCode: number;
  message: string;
  data?: Production; // only available if success
}

export interface Result {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

export async function getTaskByBatch(batch: string): Promise<GetTaskByBatchResult> {
  try {
    const response = await api.get<Production>(`/productions/${batch}`);
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

export async function createProduction(payload: any): Promise<UpdateProductionResponse> {
  console.log('cek payload', payload);
  
  try {
    const response = await api.post(`/productions/create`, {data: payload});
    console.log('res create', response);
    
    return {
      success: true,
      status: response.status,
      message: "Product has been created",
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || "Failed to fetch task",
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        status: 0,
        message: "No response from server",
      };
    } else {
      // Something unexpected happened
      return {
        success: false,
        status: 0,
        message: error.message || "Unexpected error",
      };
    }
  }
}

export const updateProduction = async (
  batch: string,
  formData: any
): Promise<UpdateProductionResponse> => {
   try {
    const response = await api.post<Production>(`/productions/${batch}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return {
      success: true,
      status: response.status,
      message: "Task rejected successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response.data);
    
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || "Failed to fetch task",
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        status: 0,
        message: "No response from server",
      };
    } else {
      // Something unexpected happened
      return {
        success: false,
        status: 0,
        message: error.message || "Unexpected error",
      };
    }
  }
}

//     return {
//       success: true,
//       status: response.status,
//       message: "Production updated successfully",
//       data: response.data,
//     };
//   } catch (error: any) {

//     return {
//       success: false,
//       status: error?.response?.status ?? 500,
//       message:
//         error?.response?.data?.message || "Failed to update production",
//     };
//   }


export async function approveProduction(batch: string): Promise<GetTaskByBatchResult> {
  try {
    const response = await api.post<Production>(`/productions/${batch}/approve`);
    return {
      success: true,
      statusCode: response.status,
      message: "Product has been approved",
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

export async function rejcetProduction(batch: string, payload: RejectProductionPayload): Promise<GetTaskByBatchResult> {
  
  const formData = new FormData();
  formData.append('batch', payload.batch);
  formData.append('qty', payload.qty);
  formData.append('can_repaired', payload.can_repaired);
  formData.append('rejected_at', payload.rejected_at);
  formData.append('rejected_reason', payload.rejected_reason);
  formData.append('attachment', payload.attachment[0]);
  
  try {
    const response = await api.post<Production>(`/productions/${batch}/reject`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return {
      success: true,
      statusCode: response.status,
      message: "Task rejected successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response.data);
    
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

export const entryProduction = async (
  batch: string,
  payload: EntryProductionPayload
): Promise<UpdateProductionResponse> => {
  try {
    const response = await api.patch<Production>(`/productions/${batch}/entry`, payload);

    return {
      success: true,
      status: response.status,
      message: "Production updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      status: error?.response?.status ?? 500,
      message:
        error?.response?.data?.message || "Failed to update production",
    };
  }
};

export async function addNewProduct(payload: any): Promise<Result> {
  try {
    const response = await api.post(`/new-products`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return {
      success: true,
      statusCode: response.status,
      message: "Produk baru berhasil ditambahkan",
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to add product",
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

export async function editNewProduct(payload: any, id: string): Promise<Result> {
  try {
    const response = await api.post(`/new-products/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return {
      success: true,
      statusCode: response.status,
      message: "Produk berhasil diperbaharui",
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to add product",
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

export async function getListProduct(): Promise<ApiResponse<Product[]>> {
  try {
    const response = await api.get(`/new-products`);
    return {
      success: true,
      statusCode: response.status,
      message: "List Product fetched successfully",
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

export async function getDetailProduct(id: string): Promise<Result> {
  try {
    const response = await api.get(`/new-products/${id}`);
    return {
      success: true,
      statusCode: response.status,
      message: "Detail Product fetched successfully",
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

export async function getSewingEmployee(): Promise<Result> {
  try {
    const response = await api.get(`/employees`, {
      params: {
        role_id: 23
      }
    });
    return {
      success: true,
      statusCode: response.status,
      message: "Detail Product fetched successfully",
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

export async function proccessProduct(payload: any, productId: string, path: string): Promise<Result> {
  try {
    const response = await api.post(`/new-products/${productId}/${path}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return {
      success: true,
      statusCode: response.status,
      message: "Add product successfully",
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to add product",
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

export async function approveNewProduct(productId: string): Promise<Result> {
  
  try {
    const response = await api.post(`/new-products/${productId}/approve`);
    return {
      success: true,
      statusCode: response.status,
      message: "Approve product successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response);
    
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to add product",
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

export async function rejectNewProduct(productId: string, payload?: any): Promise<Result> {
  
  try {
    const response = await api.post(`/new-products/${productId}/reject`, payload);
    return {
      success: true,
      statusCode: response.status,
      message: "Approve product successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response);
    
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to add product",
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

export async function repairNewProduct(productId: string, payload?: any): Promise<Result> {
  
  try {
    const response = await api.post(`/new-products/${productId}/resolve`, payload);
    return {
      success: true,
      statusCode: response.status,
      message: "Approve product successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response);
    
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to add product",
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

export async function deleteNewProduct(productId: string): Promise<Result> {
  try {
    const response = await api.delete(`/new-products/${productId}}`);
    return {
      success: true,
      statusCode: response.status,
      message: "Delete product successfully",
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to add product",
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

export async function assignSewnTask(payload: any): Promise<Result> {
  
  try {
    const response = await api.post(`/productions/set-sewn`, payload);
    return {
      success: true,
      statusCode: response.status,
      message: "Assign task successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response);
    
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to assign task",
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

export async function createProductionPlan(payload: any): Promise<Result> {
  
  try {
    const response = await api.post(`/productions/plans`, payload);
    return {
      success: true,
      statusCode: response.status,
      message: "Create production plan successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response);
    
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to Create production plan",
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

export async function createProductionPriority(payload: any): Promise<Result> {
  
  try {
    const response = await api.post(`/productions/priorities`, payload);
    return {
      success: true,
      statusCode: response.status,
      message: "Create production priority successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.log('cek error', error.response);
    
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to Create production priority",
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

export async function getMonitoringProduct(params: any): Promise<Result> {
  try {
    const response = await api.get(`/productions/monitoring`, params);
    return {
      success: true,
      statusCode: response.status,
      message: "Monitoring Product fetched successfully",
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Failed to fetch Monitoring",
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