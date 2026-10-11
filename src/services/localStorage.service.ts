import { LOCAL_STORAGE_KEYS } from '@/constants';
import { User, Post } from '@/types';

export const LocalStorageService = {
  /**
   * Get auth token from localStorage
   * @returns string | null
   */
  getAuthToken: (): string | null => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Set auth token in localStorage
   * @param token string
   */
  setAuthToken: (token: string): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
  },

  /**
   * Remove auth token from localStorage
   */
  removeAuthToken: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get user from localStorage
   * @returns User | null
   */
  getUser: (): User | null => {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) as User : null;
  },

  /**
   * Set user in localStorage
   * @param user User
   */
  setUser: (user: User): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Remove user from localStorage
   */
  removeUser: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  },

  /**
   * Clear all writespace-related data from localStorage
   */
  clearAll: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  },

  /**
   * Check if user is authenticated based on localStorage
   * @returns boolean
   */
  isAuthenticated: (): boolean => {
    return !!LocalStorageService.getAuthToken();
  },
};