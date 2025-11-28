import { AlertTriangle } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { isConfigured } from './lib/supabase';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  // Mostrar aviso si Supabase no está configurado aún
  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Toaster position="top-right" />
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuración Requerida</h2>
          <p className="text-gray-600 mb-6">
            Para usar el sistema CRUD, necesitas conectar Supabase haciendo clic en el botón
            <strong> "Connect to Supabase"</strong> en la esquina superior derecha.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Pasos:</strong><br/>
              1. Haz clic en "Connect to Supabase"<br/>
              2. Sigue las instrucciones de configuración<br/>
              3. La aplicación se cargará automáticamente
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;