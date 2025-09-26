export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

export interface ProductVariant {
  id: string;
  product_id: number;
  sku: string;
  stock: number;
  min_stock: number;
  price: number;
  color: string;
  size_id: number;
  image: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
  };
  size: {
    id: number;
    name: string;
  };
}