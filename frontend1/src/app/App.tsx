import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#F9FAFB',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </AuthProvider>
  );
}