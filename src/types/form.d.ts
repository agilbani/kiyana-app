export interface LoginForm {
  userId: string;
  password: string;
}

export interface BatchInput {
  barcode: string;
  qty_done: number;
  notes: string;
}
