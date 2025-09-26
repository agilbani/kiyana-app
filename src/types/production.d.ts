// ---------- Basic reusable types ----------
export interface Unit {
  id: number;
  name: string;
  slug: string;
}

export interface Material {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  unit_id: number;
  color_id: number;
  created_at: string;
  updated_at: string;
  supplier_id: string;
  unit: Unit;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  level: string;
  weight: string;
  material: Material;
  other_fee: number;
  sort_name?: string | null;
  created_at: string;
  sewing_fee: number;
  updated_at: string;
  category_id: number;
  cutting_fee: number;
  description?: string | null;
  material_id: number;
  finishing_fee: number;
  material_usages: string;
}

export interface Size {
  id: number;
  name: string;
  category_id: number;
}

export interface VariantMetadata {
  id: number;
  sku: string;
  size: Size;
  color: string;
  image?: string | null;
  price: number;
  stock: number;
  product: Product;
  size_id: number;
  is_active: number;
  min_stock?: number;
  created_at: string;
  product_id: number;
  updated_at: string;
}

export interface ProductionItem {
  id: number;
  production_plan_id: number;
  product_variant_id: number;
  variant_metadata: VariantMetadata;
  sku: string;
  qty: number;
  cutting_at: string;
  unit: string;
}

// ---------- User metadata (cuttingBy, sewingBy, etc.) ----------
export interface ProductionUser {
  id: number;
  role_id: number;
  division_id: number;
  shift_id?: number | null;
  nrp: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  type: string;
  is_host: boolean;
  basic_salary?: number | null;
  bank?: string | null;
  bank_account?: string | null;
  bank_number?: string | null;
  balance: number;
  keep_balance: boolean;
  leave_quota: number;
  join_at: string;
  color?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

// ---------- Main Production interface ----------
export interface Production {
  id: number;
  batch: string;
  qty: number;
  status: string;
  cutting_at: string;
  cuttingBy: ProductionUser;
  sewing_at?: string | null;
  sewingBy?: ProductionUser | null;
  finishing_at?: string | null;
  finishingBy?: ProductionUser | null;
  start_sewing_at?: string | null;
  end_sewing_at?: string | null;
  start_finishing_at?: string | null;
  end_finishing_at?: string | null;
  production_item: ProductionItem;
  production_entry_count?: number | null;
  production_priority_entry?: any; // adjust type if you know the shape
  rejected?: any; // adjust type if you know the shape
}

export interface UpdateProductionPayload {
  sewing_by?: number;
  start_sewing_at?: string;
  end_sewing_at?: string;
  finishing_by?: number;
  start_finishing_at?: string;
  end_finishing_at?: string;
}

export interface UpdateProductionResponse {
  success: boolean;
  status: number;
  message: string;
  data?: any;
}

export interface EntryProductionPayload {
  qty: number;
}

export interface RejectProductionPayload {
  qty: numbe | any;
  batch: string;
  can_repaired: boolean | any;
  rejected_at: string;
  rejected_reason: string;
  attachment: any
}