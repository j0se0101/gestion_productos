import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/products';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState<'created_at' | 'price' | 'name'>('created_at');
  const [orderAsc, setOrderAsc] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const categories = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros'];

  const { data, isLoading } = useQuery<{ items: Product[]; total: number; page: number; pageSize: number }>({
    queryKey: [
      'products',
      user?.id,
      { searchTerm, selectedCategory, page, pageSize, orderBy, orderAsc },
    ],
    enabled: !!user?.id,
    queryFn: async (): Promise<{ items: Product[]; total: number; page: number; pageSize: number }> => {
      if (!user?.id) return { items: [], total: 0, page, pageSize };
      const res = await getProducts(user.id, {
        q: searchTerm || undefined,
        category: selectedCategory || undefined,
        page,
        pageSize,
        orderBy,
        orderAsc,
      });
      return res;
    },
  });

  const productItems = data?.items ?? [];
  const total = data?.total ?? 0;

  const createMutation = useMutation({
    mutationFn: (data: Omit<Product, 'id' | 'created_at' | 'user_id'>) =>
      createProduct(user!.id, data),
    onSuccess: () => {
      toast.success('Producto creado');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => toast.error(err?.message ?? 'Error creando producto'),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; data: Omit<Product, 'id' | 'created_at' | 'user_id'> }) =>
      updateProduct(vars.id, vars.data),
    onSuccess: () => {
      toast.success('Producto actualizado');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => toast.error(err?.message ?? 'Error actualizando producto'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success('Producto eliminado');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => toast.error(err?.message ?? 'Error eliminando producto'),
  });

  const handleSubmit = async (productData: Omit<Product, 'id' | 'created_at' | 'user_id'>) => {
    if (!user?.id) return;
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteMutation.mutate(id);
    }
  };

  // Los filtros ahora se aplican en el servidor. Renderizamos la lista recibida.

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Productos</h2>
            <p className="text-gray-600">Gestiona tu inventario de productos</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <ProductTable
          products={productItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Controles de orden */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Ordenar por:</label>
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as typeof orderBy)}
            className="px-2 py-1 border rounded"
          >
            <option value="created_at">Fecha</option>
            <option value="price">Precio</option>
            <option value="name">Nombre</option>
          </select>
          <button
            onClick={() => setOrderAsc((prev) => !prev)}
            className="px-3 py-1 border rounded text-sm"
          >
            {orderAsc ? 'Ascendente' : 'Descendente'}
          </button>
        </div>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          {total === 0
            ? 'Sin resultados'
            : `Mostrando ${Math.min((page - 1) * pageSize + 1, total)}–${Math.min(page * pageSize, total)} de ${total}`}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm">Página {page}</span>
          <button
            onClick={() => {
              const maxPage = Math.max(1, Math.ceil(total / pageSize));
              setPage((p) => Math.min(maxPage, p + 1));
            }}
            disabled={page >= Math.ceil(total / pageSize) || total === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="px-2 py-1 border rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </>
  );
}

export default Dashboard;