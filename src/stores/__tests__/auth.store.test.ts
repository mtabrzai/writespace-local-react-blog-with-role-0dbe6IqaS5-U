import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { useAuthStore, authActions } from '@/stores/auth.store';
import { LocalStorageService } from '@/services/localStorage.service';
import { ERROR_MESSAGES, LOCAL_STORAGE_KEYS, SUCCESS_MESSAGES } from '@/constants';

vi.mock('axios');
vi.mock('@/services/localStorage.service');

const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockToken = 'test-token';

describe('auth store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearError();
    LocalStorageService.clearAll();
  });

  describe('login', () => {
    it('should login successfully and set user and token', async () => {
      const mockResponse = {
        data: {
          data: {
            user: mockUser,
            token: mockToken,
          },
        },
      };

      vi.mocked(axios.post).mockResolvedValue(mockResponse);
      vi.mocked(LocalStorageService.setAuthToken).mockImplementation(() => {});
      vi.mocked(LocalStorageService.setUser).mockImplementation(() => {});

      const credentials = { email: 'test@example.com', password: 'password' };
      const result = await authActions.login(credentials);

      expect(axios.post).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        credentials
      );
      expect(LocalStorageService.setAuthToken).toHaveBeenCalledWith(mockToken);
      expect(LocalStorageService.setUser).toHaveBeenCalledWith(mockUser);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().token).toEqual(mockToken);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS });
    });

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials';
      vi.mocked(axios.post).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const credentials = { email: 'test@example.com', password: 'wrong' };
      const result = await authActions.login(credentials);

      expect(useAuthStore.getState().error).toEqual(errorMessage);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(result).toEqual({ success: false, message: errorMessage });
    });

    it('should handle network error during login', async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error('Network error'));

      const credentials = { email: 'test@example.com', password: 'password' };
      const result = await authActions.login(credentials);

      expect(useAuthStore.getState().error).toEqual(ERROR_MESSAGES.NETWORK_ERROR);
      expect(result).toEqual({ success: false, message: ERROR_MESSAGES.NETWORK_ERROR });
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      vi.mocked(axios.post).mockResolvedValue({});

      const credentials = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      const result = await authActions.register(credentials);

      expect(axios.post).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        credentials
      );
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.REGISTER_SUCCESS });
    });

    it('should handle registration error', async () => {
      const errorMessage = 'Email already exists';
      vi.mocked(axios.post).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const credentials = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      const result = await authActions.register(credentials);

      expect(useAuthStore.getState().error).toEqual(errorMessage);
      expect(result).toEqual({ success: false, message: errorMessage });
    });
  });

  describe('logout', () => {
    it('should logout successfully and clear state', async () => {
      vi.mocked(LocalStorageService.getAuthToken).mockReturnValue(mockToken);
      vi.mocked(axios.post).mockResolvedValue({});
      vi.mocked(LocalStorageService.clearAll).mockImplementation(() => {});

      useAuthStore.getState().setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      });

      await authActions.logout();

      expect(axios.post).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
      expect(LocalStorageService.clearAll).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should handle logout error gracefully', async () => {
      vi.mocked(LocalStorageService.getAuthToken).mockReturnValue(mockToken);
      vi.mocked(axios.post).mockRejectedValue(new Error('Logout failed'));
      vi.mocked(LocalStorageService.clearAll).mockImplementation(() => {});

      useAuthStore.getState().setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      });

      await authActions.logout();

      expect(LocalStorageService.clearAll).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('should authenticate when valid token and user exist', async () => {
      vi.mocked(LocalStorageService.getAuthToken).mockReturnValue(mockToken);
      vi.mocked(LocalStorageService.getUser).mockReturnValue(mockUser);
      vi.mocked(axios.get).mockResolvedValue({ data: { data: mockUser } });

      await authActions.checkAuth();

      expect(axios.get).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().token).toEqual(mockToken);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should logout when no token exists', async () => {
      vi.mocked(LocalStorageService.getAuthToken).mockReturnValue(null);
      const logoutSpy = vi.spyOn(authActions, 'logout');

      await authActions.checkAuth();

      expect(logoutSpy).toHaveBeenCalled();
    });

    it('should logout when token validation fails', async () => {
      vi.mocked(LocalStorageService.getAuthToken).mockReturnValue(mockToken);
      vi.mocked(LocalStorageService.getUser).mockReturnValue(mockUser);
      vi.mocked(axios.get).mockRejectedValue(new Error('Invalid token'));
      const logoutSpy = vi.spyOn(authActions, 'logout');

      await authActions.checkAuth();

      expect(logoutSpy).toHaveBeenCalled();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      useAuthStore.getState().setState({ error: 'Some error' });
      authActions.clearError();
      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});