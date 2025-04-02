
import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#fff',
          color: '#333',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          padding: '16px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        success: {
          style: {
            border: '1px solid #10b981',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          style: {
            border: '1px solid #ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
