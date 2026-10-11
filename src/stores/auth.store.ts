import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocalStorageService } from '@/services/localStorage.service';
import { API_ENDPOINTS, ERROR_MESSAGES, LOCAL_STORAGE_KEYS, SUCCESS_MESSAGES } from '@/constants';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),
    {
      name: LOCAL_STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        user: persistedState.user || currentState.user,
        token: persistedState.token || currentState.token,
        isAuthenticated: persistedState.isAuthenticated || currentState.isAuthenticated,
      }),
    }
  )
);

export const authActions = {
  login: async (credentials: LoginCredentials) => {
    const { set } = useAuthStore.getState();
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post<{ data: { user: User; token: string } }>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials
      );

      const { user, token } = response.data.data;
      LocalStorageService.setAuthToken(token);
      LocalStorageService.setUser(user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
        : ERROR_MESSAGES.NETWORK_ERROR;

      set({
        error: errorMessage,
        isLoading: false,
      });

      return { success: false, message: errorMessage };
    }
  },

  register: async (credentials: RegisterCredentials) => {
    const { set } = useAuthStore.getState();
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, credentials);

      set({ isLoading: false });
      return { success: true, message: SUCCESS_MESSAGES.REGISTER_SUCCESS };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
        : ERROR_MESSAGES.NETWORK_ERROR;

      set({
        error: errorMessage,
        isLoading: false,
      });

      return { success: false, message: errorMessage };
    }
  },

  logout: async () => {
    const { set } = useAuthStore.getState();
    set({ isLoading: true, error: null });

    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
          },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      LocalStorageService.clearAll();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    const { set } = useAuthStore.getState();
    const token = LocalStorageService.getAuthToken();
    const user = LocalStorageService.getUser();

    if (!token || !user) {
      authActions.logout();
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.get<{ data: User }>(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        user: response.data.data,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      authActions.logout();
    }
  },

  clearError: () => {
    const { set } = useAuthStore.getState();
    set({ error: null });
  },
};