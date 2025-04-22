import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
}));

export default useAuthStore;
