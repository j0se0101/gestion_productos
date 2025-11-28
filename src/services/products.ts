import { supabase } from '../lib/supabase';
import { Product } from '../types';

export type ProductCreate = Omit<Product, 'id' | 'created_at' | 'user_id'>;
export type ProductUpdate = Partial<ProductCreate> & { id: string };
export type ProductFilters = {
  q?: string;
  category?: string;
  inStock?: boolean;
  orderBy?: 'created_at' | 'price' | 'name';
  orderAsc?: boolean;
  page?: number;
  pageSize?: number;
};
export type Page<T> = { items: T[]; total: number; page: number; pageSize: number };

function applyFilters(query: ReturnType<typeof supabase.from>, userId: string, filters?: ProductFilters) {
  let q = query.select('*', { count: 'exact' }).eq('user_id', userId);

  if (filters?.q && filters.q.trim()) {
    const term = filters.q.trim();
    q = q.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }
  if (filters?.category) {
    q = q.eq('category', filters.category);
  }
  if (typeof filters?.inStock === 'boolean') {
    q = q.eq('in_stock', filters.inStock);
  }

  const orderBy = filters?.orderBy ?? 'created_at';
  const orderAsc = filters?.orderAsc ?? false;
  q = q.order(orderBy, { ascending: orderAsc });

  return q;
}

export async function getProducts(userId: string, filters?: ProductFilters): Promise<Page<Product>> {
  const page = Math.max(1, filters?.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, filters?.pageSize ?? 10));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = applyFilters(supabase.from('products'), userId, filters).range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;
  return { items: data ?? [], total: count ?? 0, page, pageSize };
}

export async function createProduct(userId: string, data: ProductCreate): Promise<Product> {
  const { data: rows, error } = await supabase
    .from('products')
    .insert({ ...data, user_id: userId })
    .select('*')
    .single();
  if (error) throw error;
  return rows as Product;
}

export async function updateProduct(id: string, data: ProductCreate): Promise<void> {
  const { error } = await supabase.from('products').update(data).eq('id', id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
