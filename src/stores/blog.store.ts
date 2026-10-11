import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_ENDPOINTS, ERROR_MESSAGES, LOCAL_STORAGE_KEYS, SUCCESS_MESSAGES } from '@/constants';
import { Post, PaginatedResponse, PaginationParams } from '@/types';
import { LocalStorageService } from '@/services/localStorage.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BlogState {
  posts: Post[];
  publishedPosts: Post[];
  draftPosts: Post[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface BlogActions {
  fetchPosts: (params?: Partial<PaginationParams>) => Promise<void>;
  fetchPostById: (id: string) => Promise<Post | null>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'published'>) => Promise<{ success: boolean; message: string }>;
  updatePost: (id: string, post: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>) => Promise<{ success: boolean; message: string }>;
  deletePost: (id: string) => Promise<{ success: boolean; message: string }>;
  publishPost: (id: string) => Promise<{ success: boolean; message: string }>;
  unpublishPost: (id: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
}

export const useBlogStore = create<BlogState & BlogActions>()(
  persist(
    (set, get) => ({
      posts: [],
      publishedPosts: [],
      draftPosts: [],
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },

      fetchPosts: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
          const response = await axios.get<PaginatedResponse<Post>>(`${API_BASE_URL}${API_ENDPOINTS.POSTS.BASE}`, {
            params: { page, limit, sortBy, sortOrder },
            headers: {
              Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
            },
          });

          const { data, total, page: currentPage, limit: currentLimit, totalPages } = response.data;
          const publishedPosts = data.filter(post => post.published);
          const draftPosts = data.filter(post => !post.published);

          set({
            posts: data,
            publishedPosts,
            draftPosts,
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

          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      fetchPostById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get<{ data: Post }>(`${API_BASE_URL}${API_ENDPOINTS.POSTS.BASE}/${id}`, {
            headers: {
              Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
            },
          });
          return response.data.data;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR
            : ERROR_MESSAGES.NETWORK_ERROR;

          set({
            error: errorMessage,
            isLoading: false,
          });
          return null;
        }
      },

      createPost: async (post) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post<{ data: Post }>(
            `${API_BASE_URL}${API_ENDPOINTS.POSTS.BASE}`,
            post,
            {
              headers: {
                Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
              },
            }
          );

          const newPost = response.data.data;
          set((state) => ({
            posts: [newPost, ...state.posts],
            draftPosts: [newPost, ...state.draftPosts],
            isLoading: false,
          }));

          return { success: true, message: SUCCESS_MESSAGES.POST_CREATED };
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

      updatePost: async (id, post) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.patch<{ data: Post }>(
            `${API_BASE_URL}${API_ENDPOINTS.POSTS.BASE}/${id}`,
            post,
            {
              headers: {
                Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
              },
            }
          );

          const updatedPost = response.data.data;
          set((state) => ({
            posts: state.posts.map(p => p.id === id ? updatedPost : p),
            publishedPosts: state.publishedPosts.map(p => p.id === id ? updatedPost : p),
            draftPosts: state.draftPosts.map(p => p.id === id ? updatedPost : p),
            isLoading: false,
          }));

          return { success: true, message: SUCCESS_MESSAGES.POST_UPDATED };
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

      deletePost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.POSTS.BASE}/${id}`, {
            headers: {
              Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
            },
          });

          set((state) => ({
            posts: state.posts.filter(p => p.id !== id),
            publishedPosts: state.publishedPosts.filter(p => p.id !== id),
            draftPosts: state.draftPosts.filter(p => p.id !== id),
            isLoading: false,
          }));

          return { success: true, message: SUCCESS_MESSAGES.POST_DELETED };
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

      publishPost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post<{ data: Post }>(
            `${API_BASE_URL}${API_ENDPOINTS.POSTS.PUBLISH(id)}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
              },
            }
          );

          const publishedPost = response.data.data;
          set((state) => ({
            posts: state.posts.map(p => p.id === id ? publishedPost : p),
            publishedPosts: [publishedPost, ...state.publishedPosts.filter(p => p.id !== id)],
            draftPosts: state.draftPosts.filter(p => p.id !== id),
            isLoading: false,
          }));

          return { success: true, message: SUCCESS_MESSAGES.POST_PUBLISHED };
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

      unpublishPost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post<{ data: Post }>(
            `${API_BASE_URL}${API_ENDPOINTS.POSTS.UNPUBLISH(id)}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${LocalStorageService.getAuthToken()}`,
              },
            }
          );

          const unpublishedPost = response.data.data;
          set((state) => ({
            posts: state.posts.map(p => p.id === id ? unpublishedPost : p),
            publishedPosts: state.publishedPosts.filter(p => p.id !== id),
            draftPosts: [unpublishedPost, ...state.draftPosts.filter(p => p.id !== id)],
            isLoading: false,
          }));

          return { success: true, message: SUCCESS_MESSAGES.POST_UNPUBLISHED };
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

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'writespace:blogStore',
      partialize: (state) => ({
        posts: state.posts,
        publishedPosts: state.publishedPosts,
        draftPosts: state.draftPosts,
      }),
    }
  )
);