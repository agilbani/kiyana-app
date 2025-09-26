export interface Size {
  id: number;
  category_id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  attributes_count: number;
  sizes: Size[];
}

export interface MasterResponse {
  success: boolean;
  message: string;
  data?: any; // array of loans
}

export interface Supplier {
  id: string;
  name: string;
}

export interface ColorInterface {
  id: number;
  name: string;
  slug: string;
}

export interface Unit {
  id: number;
  name: string;
  slug: string;
}

export interface Material {
  id: number;
  supplier_id: string;
  unit_id: number;
  color_id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  supplier: Supplier;
  color: ColorInterface;
  unit: Unit;
}