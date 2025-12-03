---> Sistema CRUD de Productos

Una aplicación web moderna para la gestión de inventario de productos desarrollada  para el frontend con React y Typescript para el backend con Supabase.

Sistema completo de administración de productos que permite a los usuarios registrados crear,leer,actualizar y eliminar productos de su inventario personal.
Cada usuario tiene acceso exclusivo a sus propios productos mediante autenticación segura y politicas de seguridad a nivel de bases de datos (RLS).

---> Componentes
<div align="center">
Autenticación y Seguridad
  
- Sistema de registro e inicio de sesión
- Autenticación segura con Supabase Auth
- Row Level Security (RLS) en base de datos
- Sesiones persistentes
- Rutas protegidas
</div>
<div align="center">
  <img width="100%" max-width="800px" alt="image" src="https://github.com/user-attachments/assets/09733d26-f4a6-49f0-9529-0d5abe1510e8" />
  <img width="100%" max-width="800px" alt="image" src="https://github.com/user-attachments/assets/1b97c575-6eb2-432e-8dfa-f861775477e9" />
  <img width="100%" max-width="800px" alt="image" src="https://github.com/user-attachments/assets/b26b4395-b93b-41eb-8b04-21a96dde7d5e" />
</div>

<div align="center">
Gestión de productos
  
Crear productos con información completa
- Leer lista de productos con datos detallados
- Actualizar información de productos existentes
- Eliminar productos con confirmación
- Control de disponibilidad (en stock/agotado)
- Categorización de productos
</div>

<div align="center">
<img width="100%" max-width="800px" alt="image" src="https://github.com/user-attachments/assets/d6119bc9-c421-4f4e-a6ea-a367afccdf00" />
<img width="100%" max-width="800px" alt="image" src="https://github.com/user-attachments/assets/16963e20-3ca0-4c23-87e0-9ed602b46d0c" />
<img width="100%" max-width="800px" alt="image" src="https://github.com/user-attachments/assets/fbc5396d-df91-4f9d-a108-05fd512db56a" />
</div>

<div align="center">
Búsqueda y Filtrado

- Búsqueda por nombre o descripción
- Filtrado por categoría
- Ordenamiento por fecha, precio o nombre
- Orden ascendente/descendente
</div>

<div align="center">
<img width="100%" max-width="800px" alt="image" src="https://github.com/user-attachments/assets/73872869-0cb0-4b6a-8914-8209ecef3bb2" />
</div>

---> Tecnologías
<div align="center">
Frontend
  
- React 18.3 Biblioteca UI
- TypeScript 5.5  Tipado estático
- Vite 7.1  Build tool y dev server
- React Router DOM 7.8 Enrutamiento
- Tailwind CSS 3.4 Estilos

Backend & Base de Datos
- Supabase  Backend as a Service
- PostgreSQL database
- Authentication
- Row Level Security
</div>

---> Instalación y configuración
<div align="center">
Clonar el repositorio 
  
- git clone https://github.com/j0se0101/gestion_productos
- cd products 
</div>

<div align="center">
Instalar dependencias
  
- npm install
</div>

<div align="center">
Configuración en Supabase
  
- Crear proyecto en Supabase
- Visitar  supabase.com
- Crea una cuenta o inicia sesión
- Crea un nuevo proyecto
- Anota la URL y la clave anónima

Aplicación de migración de bases de datos en SQL editor de Supabase
- Connfigurar variables de entorno dentro del achivo .env 
- VITE_SUPABASE_URL=tu_supabase_url
- VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
</div>

<div align="center">
Ejecutar en desarrollo
  
- npm run dev
</div>




