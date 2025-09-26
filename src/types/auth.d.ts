export interface Role {
  id: number;
  name: string;
}

export interface Division {
  id: number;
  name: string;
}

export interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  with_next_day: boolean;
  created_at: string;
  updated_at: string
}

export interface Detail {
  id: number;
  employee_id: number;
  birth_place: string;
  birth_date: string;
  blood_type: string;
  identity_type: string;
  identity_number: string;
  gender: string;
  marital_status: string;
  religion: string;
  identity_address: string;
  address: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
}

export interface User {
  id?: number;
  username?: string | null;
  nrp?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  type?: string | null;
  is_host?: boolean | null;
  balance?: number;
  keep_balance?: boolean | null;
  leave_quota?: number | null;
  join_at?: string | null;
  color?: string | null;
  role?: Role | null;
  division?: Division | null;
  detail?: Detail | null;
  token?: string | null;
  shift: Shift | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthHookResult {
  user: User | null;
  loadingInitial: boolean;
  loadingUser: boolean;
  login: (userDataWithToken: User) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
}
