import { create } from "zustand";
import { loginUser, logoutUser, getMe } from "../api/auth";
import { postUser } from "../api/users";

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface UserStore {
  users: User[];
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  createUser: (userData: RegisterPayload) => Promise<User>;
  error: BackendError | null;
  loading: boolean;
}

interface BackendError {
  message: string;
  details?: any[];
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  error: null,
  loading: false,

  createUser: async (userData: RegisterPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await postUser(userData);
      console.log("Backend Response:", response);
      const createdUser = response.user;
      set((state) => ({
        loading: false,
        users: [...state.users, createdUser],
        user: createdUser,
        isAuthenticated: true,
      }));
      return createdUser;
    } catch (error: any) {
      const backendError = error.response?.data || { message: error.message };
      set({ error: backendError, loading: false });
      throw backendError;
    }
  },
  login: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await loginUser(userData);
      const user = response.user;
      set({ user: user, isAuthenticated: true, loading: false });
    } catch (error: any) {
      const backendError = error.response?.data || { message: error.message };
      set({
        error: backendError,
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        loading: false,
      });
      throw backendError;
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      const response = await logoutUser();
      set({ isAuthenticated: false, loading: false, user: null });
    } catch (error: any) {
      const backendError = error.response?.data || { message: error.message };
      set({ error: backendError, loading: false });
    }
  },
  checkAuth: async () => {
    set({ loading: true, isCheckingAuth: true });
    try {
      const response = await getMe();
      const user = response.user;
      set({ isAuthenticated: true, loading: false, user: user });
    } catch (error: any) {
      set({
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null,
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
