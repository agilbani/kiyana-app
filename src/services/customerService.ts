import api from "@/api/api";
import { Customer } from '@/types/customer';
import { ApiResponse } from '@/types/productVariant';

export async function getCustomer(): Promise<ApiResponse<Customer[]>> {
	const res = await api.get<Customer[]>(
		`/master/customers`
	);
	return {
		success: true,
		statusCode: res.status,
		data: res.data,
	};
}

export const createCustomer = async (
  payload: any
) => {
  try {
    const response = await api.post("/master/customers", payload);

    return {
      success: true,
      message: 'Data customer berhasil ditambahkan.',
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Terjadi kesalahan saat menambahkan data customer.",
    };
  }
};

export const editCustomer = async (
  payload: any,
	id: any
) => {
  try {
    const response = await api.patch(`/master/customers/${id}`, payload);

    return {
      success: true,
      message: 'Data customer berhasil dirubah.',
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Terjadi kesalahan saat menambahkan data customer.",
    };
  }
};

export async function deleteCustomer (id: any) {
	const res = await api.delete(
		`/master/customers/${id}`
	);
	return {
		success: true,
		statusCode: res.status,
		data: res.data,
	};
}