// Category
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Unit
export interface Unit {
  id: number;
  name: string;
  slug: string;
}

// Material
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
  unit?: Unit;
}

// Product Metadata
export interface ProductMetadata {
  id: number;
  name: string;
  slug: string;
  level: string;
  weight: string;
  category: Category;
  material: Material;
  other_fee: number;
  created_at: string;
  sewing_fee: number;
  updated_at: string;
  category_id: number;
  cutting_fee: number;
  material_id: number;
  finishing_fee: number;
  material_usages: string;
}

// Size
export interface Size {
  id: number;
  name: string;
  category_id: number;
}

// Variant Metadata
export interface VariantMetadata {
  id: number;
  sku: string;
  size: Size;
  color: string;
  image: string | null;
  price: number;
  stock: number;
  product: ProductMetadata;
  size_id: number;
  is_active: number;
  created_at: string;
  product_id: number;
  updated_at: string;
}

// Task Item
export interface TaskItem {
  id: number;
  production_plan_id: number;
  product_variant_id: number;
  variant_metadata: VariantMetadata;
  sku: string;
  qty: number;
  status: string;
  cutting_at: string;
  unit: string;
}

// User (for cutting_by or created_by)
export interface UserSimple {
  id: number;
  role_id?: number;
  division_id?: number;
  shift_id?: number | null;
  nrp?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  type?: string;
  is_host?: boolean;
  basic_salary?: number | null;
  bank?: string | null;
  bank_account?: string | null;
  bank_number?: string | null;
  balance?: number;
  keep_balance?: boolean;
  leave_quota?: number;
  join_at?: string;
  color?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string;
}

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

export interface CreatedBy {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface ListTask {
  id: number;
  product_id: number;
  code: string;
  date: string;
  product_metadata: ProductMetadata;
  cutting_by: Employee;
  status: string;
  deadline: string | null;
  created_by: CreatedBy;
  created_at: string;
  updated_at: string;
  items: TaskItem[];
}

// Main Task interface
export interface Task {
  id: number;
  product_id: number;
  code: string;
  date: string;
  product_metadata: ProductMetadata;
  cutting_by: UserSimple | null;
  status: string;
  deadline: string | null;
  created_by: UserSimple;
  created_at: string;
  updated_at: string;
  items: TaskItem[];
}
