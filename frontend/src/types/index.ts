export interface Shop {
  id: number;
  name: string;
  description: string;
  image_url: string;
  rating: number;
}

export interface Product {
  id: number;
  shop_id: number;
  name: string;
  description: string;
  price: number | string;
  image_url: string;
  category: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ShopWithProducts extends Shop {
  products: Product[];
  pagination: Pagination;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

export interface Order {
  id: number;
  email: string;
  phone: string;
  address: string;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface Coupon {
  id: number;
  code: string;
  discount_percent: number;
  description: string;
  is_active: boolean;
  expires_at: string | null;
}

export interface OrderPayload {
  email: string;
  phone: string;
  address: string;
  items: {
    productId: number;
    quantity: number;
  }[];
  couponCode?: string;
}

export interface FormErrors {
  email?: string;
  phone?: string;
  address?: string;
  items?: string;
  coupon?: string;
}