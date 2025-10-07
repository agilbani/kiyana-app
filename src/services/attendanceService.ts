import api from '@/api/api';
import { AbsencePayload, ClockInPayload, ClockInResponse, GetMyAttendanceResponse } from '@/types/attendance';
import { queryParams } from '@/utils/getQueryParams';

export interface GetCurrentAttendanceResult {
  success: boolean;
  message: string;
  status?: number;
  data?: any;
}

export const getCurrentAttendance = async (type = "host"): Promise<GetCurrentAttendanceResult> => {
  try {
    const response = await api.get(`/attendances/${type}/current`);
    
    return {
      success: true,
      message: 'Berhasil mendapatkan data kehadiran saat ini.',
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log('Get current attendance error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Gagal mendapatkan data kehadiran saat ini.',
      status: error?.response?.status,
    };
  }
};

export const getMyAttendance = async (
  start: string,
  end: string
): Promise<GetMyAttendanceResponse> => {
  try {
    const response = await api.get<GetMyAttendanceResponse>(
      `/attendances`,
      {
        params: {
          start,
          end,
        },
      }
    );
    // return response.data;
    return {
      success: true,
      message: 'Berhasil mendapatkan data kehadiran saat ini.',
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log('Get current attendance error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Gagal mendapatkan data kehadiran saat ini.',
      status: error?.response?.status,
    };
  }
};

export const getAttendanceDetail = async (
  id: string,
): Promise<GetMyAttendanceResponse> => {
  try {
    const response = await api.get<GetMyAttendanceResponse>(
      `/attendances/${id}`,
    );
    // return response.data;
    return {
      success: true,
      message: 'Berhasil mendapatkan data kehadiran saat ini.',
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log('Get current attendance error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Gagal mendapatkan data kehadiran saat ini.',
      status: error?.response?.status,
    };
  }
};

export const clockIn = async (
  attendanceId: string,
  payload: ClockInPayload,
  type = "host"
): Promise<ClockInResponse> => {
  try {
    const formData = new FormData();
    formData.append('clock_in', payload.time);
    formData.append('lat_in', payload.lat_in.toString());
    formData.append('lng_in', payload.lng_in.toString());

    formData.append('image_in', {
      uri: payload.image_in.uri,
      name: payload.image_in.fileName || 'photo.jpg',
      type: payload.image_in.type || 'image/jpeg',
    } as any);
    let url = '';
    if (type === 'host') {
      url = `/attendances/host/clock-in/${attendanceId}`
    } else {
      url = `/attendances/shifted/clock-in`
    }
    const response = await api.post(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || 'Clock in success',
      status: response.status,
    };
  } catch (error: any) {
    console.log('Clock in error:', error?.response);
    return {
      success: false,
      message: error?.response?.data?.message || 'Clock in failed',
      status: error?.response?.status,
    };
  }
};

export const clockOut = async (
  attendanceId: string,
  payload: ClockInPayload,
  type = "host"
): Promise<ClockInResponse> => {
  try {
    const formData = new FormData();
    formData.append('clock_out', payload.time);
    formData.append('lat_out', payload.lat_in.toString());
    formData.append('lng_out', payload.lng_in.toString());

    formData.append('image_out', {
      uri: payload.image_in.uri,
      name: payload.image_in.fileName || 'photo.jpg',
      type: payload.image_in.type || 'image/jpeg',
    } as any);
    console.log('cek formData out', formData);
    let url = '';
    url = `/attendances/${type}/clock-out/${attendanceId}`
    const response = await api.post(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || 'Clock in success',
      status: response.status,
    };
  } catch (error: any) {
    console.error('Clock in error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Clock in failed',
      status: error?.response?.status,
    };
  }
};

export const requestAbsence = async (
  payload: AbsencePayload,
) => {
  try {
    const formData = new FormData();
    formData.append('date', payload.date);
    formData.append('type_request', payload.type_request);
    formData.append('reason', payload.reason);

    payload.attachments.forEach((image: any, index: any) => {
      formData.append(`attachments[${index}]`, {
        uri: image.uri,
        name: image.name || 'photo.jpg',
        type: image.type,
      } as any);
    })
    
    const response = await api.post(
      '/absences/request',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || 'Requst absence in success',
      status: response.status,
    };
  } catch (error: any) {
    console.log('Requst absence error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Requst absence failed',
      status: error?.response?.status,
    };
  }
};

export const getAbsence = async (payload?: any): Promise<GetMyAttendanceResponse> => {
  let url = '';
  if (Object.keys(payload).length > 0) {
    url = `/absences?${queryParams(payload)}`
  } else {
    url = '/absences'
  }
  try {
    const response = await api.get<GetMyAttendanceResponse>(
      url,
    );
    // return response.data;
    return {
      success: true,
      message: 'Berhasil mendapatkan data absence saat ini.',
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log('Get current attendance error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Gagal mendapatkan data absence saat ini.',
      status: error?.response?.status,
    };
  }
};

export const getInfoAttendance = async (payload?: any): Promise<GetMyAttendanceResponse> => {
  let url = `attendances/checked?${queryParams(payload)}`;
  try {
    const response = await api.get<GetMyAttendanceResponse>(
      url,
    );
    // return response.data;
    return {
      success: true,
      message: 'Berhasil mendapatkan data absence saat ini.',
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log('Get current attendance error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Gagal mendapatkan data absence saat ini.',
      status: error?.response?.status,
    };
  }
};

export const editAttendance = async (
  payload: any,
) => {
  try {
    const response = await api.patch(`/attendances`, payload);

    return {
      success: true,
      message: 'Data presensi berhasil dirubah.',
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Terjadi kesalahan saat menambahkan data presensi.",
    };
  }
};