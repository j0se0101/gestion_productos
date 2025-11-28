export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  created_at: string;
  user_id: string;
}

export interface AuthUser {
  id: string;
  email: string;
}