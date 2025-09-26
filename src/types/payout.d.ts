// Employee interface
export interface Employee {
  id: number;
  role_id: number;
  division_id: number;
  shift_id: number | null;
  nrp: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  type: string;
  is_host: boolean;
  basic_salary: number | null;
  bank: string | null;
  bank_account: string | null;
  bank_number: string | null;
  balance: number;
  keep_balance: boolean;
  leave_quota: number;
  join_at: string;
  color: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Payout interface
export interface Payout {
  id: string;
  employee_id: number;
  number: string;
  date: string;
  nominal: number;
  approved_at: string | null;
  approved_by: number | null;
  payment_method: string | null;
  payment_proof: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  employee: Employee;
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  message?:string;
  statusCode: number;
  data: T;
}
