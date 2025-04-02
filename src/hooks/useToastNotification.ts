
import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading';

export const useToastNotification = () => {
  const showToast = (message: string, type: ToastType = 'success') => {
    switch (type) {
      case 'success':
        return toast.success(message);
      case 'error':
        return toast.error(message);
      case 'loading':
        return toast.loading(message);
      default:
        return toast(message);
    }
  };

  return { showToast };
};
