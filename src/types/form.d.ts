export interface LoginForm {
  email: string;
  password: string;
}

export interface BatchInput {
  batch: string;
  qty: number;
  notes?: string;
  production_item_id?: string;
  cutting_at?: string;
  cutting_by?: number | any;
}

export interface ChangeShiftForm {
  date: string;
  time: string;
  reason: string;
}