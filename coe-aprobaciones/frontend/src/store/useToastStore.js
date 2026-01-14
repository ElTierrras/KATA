import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }));

    
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id)
      }));
    }, duration + 300); 
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },

  success: (message, duration = 4000) => {
    set((state) => {
      const id = Date.now();
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id)
        }));
      }, duration + 300);
      return {
        toasts: [
          ...state.toasts,
          { id, message, type: 'success', duration }
        ]
      };
    });
  },

  error: (message, duration = 4000) => {
    set((state) => {
      const id = Date.now();
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id)
        }));
      }, duration + 300);
      return {
        toasts: [
          ...state.toasts,
          { id, message, type: 'error', duration }
        ]
      };
    });
  },

  warning: (message, duration = 4000) => {
    set((state) => {
      const id = Date.now();
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id)
        }));
      }, duration + 300);
      return {
        toasts: [
          ...state.toasts,
          { id, message, type: 'warning', duration }
        ]
      };
    });
  },
}));
