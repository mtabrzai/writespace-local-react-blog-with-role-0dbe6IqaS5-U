import { create } from 'zustand';
import axios from 'axios';
import { API_ENDPOINTS, ERROR_MESSAGES, LOCAL_STORAGE_KEYS, SUCCESS_MESSAGES } from '@/constants';
import { User, PaginatedResponse, PaginationParams } from '@/types';
import { LocalStorageService } from '@/services/localStorage.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  recentUsers: User[];
  recentPosts: {
    id: string;
    title: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
    };
  }[];
}

interface AdminState {
  stats: AdminStats | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AdminActions {
  fetchStats: () => Promise<void>;
  fetchUsers: (params?: Partial<PaginationParams>) => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  updateUser: (id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<{ success: boolean; message: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState & AdminActions>((set, get) => ({
  stats: null,
  users: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<{ data: AdminStats }>(`${API_BASE_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
        },
      });
      set({ stats: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
        : ERROR_MESSAGES.NETWORK_ERROR;
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
      const response = await axios.get<PaginatedResponse<User>>(`${API_BASE_URL}${API_ENDPOINTS.USERS.BASE}`, {
        params: { page, limit, sortBy, sortOrder },
        headers: {
          Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
        },
      });

      const { data, total, page: currentPage, limit: currentLimit, totalPages } = response.data;
      set({
        users: data,
        pagination: {
          page: currentPage,
          limit: currentLimit,
          total,
          totalPages,
        },
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
        : ERROR_MESSAGES.NETWORK_ERROR;
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUserById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<{ data: User }>(`${API_BASE_URL}${API_ENDPOINTS.USERS.BASE}/${id}`, {
        headers: {
          Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
        },
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
        : ERROR_MESSAGES.NETWORK_ERROR;
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch<{ data: User }>(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.BASE}/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
          },
        }
      );

      const updatedUser = response.data.data;
      set((state) => ({
        users: state.users.map(user => user.id === id ? updatedUser : user),
        isLoading: false,
      }));

      return { success: true, message: SUCCESS_MESSAGES.POST_UPDATED };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
        : ERROR_MESSAGES.NETWORK_ERROR;
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.USERS.BASE}/${id}`, {
        headers: {
          Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
        },
      });

      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        isLoading: false,
      }));

      return { success: true, message: SUCCESS_MESSAGES.POST_DELETED };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
        : ERROR_MESSAGES.NETWORK_ERROR;
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));