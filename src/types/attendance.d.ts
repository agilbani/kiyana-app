// types/attendance.ts
export interface Attendance {
  id: string;
  employee_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  is_on_time: boolean;
  clock_in: string | null;
  image_in: string | null;
  lat_in: number | null;
  lng_in: number | null;
  clock_out: string | null;
  image_out: string | null;
  lat_out: number | null;
  lng_out: number | null;
  overtime: string;
  created_at: string;
  updated_at: string;
}

export interface ClockInResponse {
  success: boolean;
  message: string;
  status?: number;
}

interface ClockInPayload {
  time: string;
  lat_in: number;
  lng_in: number;
  image_in: any; // usually a file or Blob
}

interface AbsencePayload {
  date: string;
  type_request: string;
  reason: string;
  attachments: any
}

export interface AttendanceStatistic {
  Hadir: number;
  'Setengah Hari': number;
  Sakit: number;
  Izin: number;
  Cuti: number;
  Alfa: number;
}

export interface AttendanceHistory {
  id: string;
  employee_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  is_on_time: boolean;
  clock_in: string | null;
  image_in: string | null;
  lat_in: string | null;
  lng_in: string | null;
  clock_out: string | null;
  image_out: string | null;
  lat_out: string | null;
  lng_out: string | null;
  overtime: string;
  created_at: string;
  updated_at: string;
}

export interface GetMyAttendanceResponse {
  status: number;
  message: string;
  success: boolean;
  data?: any;
}

export interface AttendanceStatisticProps {
  data?: AttendanceStatistic | null
}

export interface AttendanceDetailAbsence {
  id: string;
  approved_at?: string | null;
  approved_by?: any | null;
  attachments?: any;
  attendance_id?: any | null;
  created_at?: string;
  date?: string;
  employee_id?: number;
  id?: string;
  reason?: string;
  rejected_reason?: string | null;
  status?: string;
  type_request?: string | null;
  updated_at?: string | null;
}