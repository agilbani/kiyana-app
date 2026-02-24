import api from "@/api/api";
import { MasterResponse } from "@/types/master";
import { queryParams } from "@/utils/getQueryParams";

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
        const res = await api.get<MasterResponse>(
            "/employees?roleName=Penjahit",
        );
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
        const res = await api.get<MasterResponse>(
            "/employees?roleName=Tukang Potong",
        );
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
        const res = await api.get<MasterResponse>(
            `/warehouse/variant-by-sku/${sku}`,
        );
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

export const checkProductionStatus = async (
    sku: string,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/productions/check-production-status/${sku}`,
        );
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
        const res = await api.post<MasterResponse>(
            `/warehouse/increase-stock`,
            payload,
        );
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
        const res = await api.post<MasterResponse>(
            `/warehouse/calculate-stock`,
            payload,
        );
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

export const getProductProduction = async (
    slug: string,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/warehouse/products/${slug}`,
        );
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

export const updateStatusFixing = async (
    payload: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.post<MasterResponse>(
            `/productions/approval/update-status`,
            payload,
        );
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

export const createPriorityBulk = async (
    payload: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.post<MasterResponse>(
            `/productions/priorities/bulk`,
            payload,
        );
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

export const materialRequest = async (
    payload: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.post<MasterResponse>(
            `/warehouse/material-requests`,
            payload,
        );
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

export const accessoriesRequest = async (
    payload: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.post<MasterResponse>(
            `/warehouse/accessories-requests`,
            payload,
        );
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

export const getHistoryTransfer = async (
    params: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/balance/history?${queryParams(params)}`,
        );
        return {
            success: true,
            message: "Success get history transfer",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Terjadi kesalahan saat get history transfer.",
        };
    }
};

export const getNotification = async (params: any): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/user/notifications?${queryParams(params)}`,
        );
        return {
            success: true,
            message: "Success get history notif",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Terjadi kesalahan saat get history notif.",
        };
    }
};

export const changeProfile = async (payload: any): Promise<MasterResponse> => {
    try {
        const res = await api.post<MasterResponse>(`/profile/change`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {
            success: true,
            message: "Berhasil memperbaharui data",
            data: res.data,
        };
    } catch (error: any) {
        console.log("failed edit profile", error.response?.data);

        return {
            success: false,
            message:
                error?.response?.data?.message ?? "Gagal memperbaharui profile",
        };
    }
};

export const changePassword = async (payload: any): Promise<MasterResponse> => {
    try {
        const res = await api.post<MasterResponse>(`/password/change`, payload);
        return {
            success: true,
            message: "Berhasil memperbaharui password",
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

export const getAbsenceRequest = async (
    params: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/absence-requests?${queryParams(params)}`,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan permohonan absensi",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data permohonan absensi",
        };
    }
};

export const getSwapAbsenceRequest = async (
    params: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/attendance-swap-requests?${queryParams(params)}`,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan permohonan tukar absensi",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data permohonan tukar absensi",
        };
    }
};

export const getDetailSwapAbsenceRequest = async (
    id: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/attendance-swap-requests/${id}`,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan detail permohonan tukar absensi",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data detail permohonan tukar absensi",
        };
    }
};

export const actionSwapAbsenceRequest = async (
    id: any,
    type: string,
    payload?: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.patch<MasterResponse>(
            `/attendance-swap-requests/${id}/${type}`,
            payload,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan detail permohonan absensi",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data detail permohonan absensi",
        };
    }
};

export const getDetailAbsenceRequest = async (
    id: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(`/absence-requests/${id}`);
        return {
            success: true,
            message: "Berhasil mendapatkan detail permohonan absensi",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data detail permohonan absensi",
        };
    }
};

export const actionAbsenceRequest = async (
    id: any,
    type: string,
    payload?: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.patch<MasterResponse>(
            `/absence-requests/${id}/${type}`,
            payload,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan detail permohonan absensi",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data detail permohonan absensi",
        };
    }
};

export const getLoanRequest = async (params: any): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/loan-requests?${queryParams(params)}`,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan permohonan tukar pinjaman",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data permohonan tukar pinjaman",
        };
    }
};

export const getDetailLoanRequest = async (
    id: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(`/loan-requests/${id}`);
        return {
            success: true,
            message: "Berhasil mendapatkan detail permohonan pinjaman",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data detail permohonan pinjaman",
        };
    }
};

export const actionLoanRequest = async (id: any): Promise<MasterResponse> => {
    try {
        const res = await api.patch<MasterResponse>(
            `/loan-requests/${id}/reject`,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan detail permohonan pinjaman",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data detail permohonan pinjaman",
        };
    }
};

export const actionApproveLoanRequest = async (
    id: any,
    payload: any,
): Promise<MasterResponse> => {
    console.log("payload approve loan", payload);

    try {
        const response = await api.post<MasterResponse>(
            `/loan-requests/${id}/approve`,
            payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return {
            success: true,
            message: "Berhasil mendapatkan detail permohonan pinjaman",
            data: response.data,
        };
    } catch (error: any) {
        console.log("cek error", error.response.data);

        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal memproses data permohonan pinjaman, silahkan hubungi admin",
        };
    }
};

export const getDataPayroll = async (params: any): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/payrolls/salaries?${queryParams(params)}`,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan data payroll",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data data payroll",
        };
    }
};

export const getDetailDataPayroll = async (
    payrollNumber: any,
    salaryId: any,
): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(
            `/payrolls/${payrollNumber}/${salaryId}/edit`,
        );
        return {
            success: true,
            message: "Berhasil mendapatkan detail data payroll",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data detail data payroll",
        };
    }
};

export const getDataLog = async (): Promise<MasterResponse> => {
    try {
        const res = await api.get<MasterResponse>(`/logs?per_page=100`);
        return {
            success: true,
            message: "Berhasil mendapatkan data log activity",
            data: res.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error?.response?.data?.message ??
                "Gagal mendapatkan data data log activity",
        };
    }
};

export const postAddStatus = async (payload: any): Promise<MasterResponse> => {
    try {
        const response = await api.post<MasterResponse>(
            `/logs/manual`,
            payload,
        );
        return {
            success: true,
            message: "Berhasil menambahkan status",
            data: response.data,
        };
    } catch (error: any) {
        console.log("cek error", error.response.data);

        return {
            success: false,
            message:
                error?.response?.data?.message ?? "Gagal menambahkan status",
        };
    }
};

export const postMuteUser = async (payload: any): Promise<MasterResponse> => {
    try {
        const response = await api.post<MasterResponse>(`/logs/mute`, payload);
        return {
            success: true,
            message: "Berhasil membisukan pengguna",
            data: response.data,
        };
    } catch (error: any) {
        console.log("cek error", error.response.data);

        return {
            success: false,
            message:
                error?.response?.data?.message ?? "Gagal membisukan pengguna",
        };
    }
};
