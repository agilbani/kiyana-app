// Product related entities
export interface Material {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface Product {
  id: string;
  material_id: number;
  category_id: number;
  size_id: number;
  name: string;
  color: string;
  description: string;
  status: string;
  images: string[];
  pattern_images: string[] | null;
  cutting_images: string[] | null;
  product_results: string[] | null;
  sewing_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  reject_reason: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  material: Material;
  category: Category;
  size: Size;
  status: string | null;
}

// Wrapper for API response
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}
