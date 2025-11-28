/*
  # Sistema CRUD - Tabla de Productos

  1. Nueva Tabla
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, nombre del producto)
      - `description` (text, descripción del producto)
      - `price` (numeric, precio del producto)
      - `category` (text, categoría del producto)
      - `in_stock` (boolean, disponibilidad)
      - `created_at` (timestamp con timezone)
      - `user_id` (uuid, referencia al usuario autenticado)

  2. Seguridad
    - Habilitar RLS en la tabla `products`
    - Políticas para que los usuarios solo puedan ver/modificar sus propios productos
    - Los usuarios autenticados pueden realizar operaciones CRUD en sus datos
*/

-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver sus propios productos
CREATE POLICY "Users can view own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para que los usuarios puedan crear productos
CREATE POLICY "Users can create own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar sus propios productos
CREATE POLICY "Users can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan eliminar sus propios productos
CREATE POLICY "Users can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);