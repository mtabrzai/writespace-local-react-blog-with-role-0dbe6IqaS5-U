import { LocalStorageService } from '@/services/localStorage.service';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { User } from '@/types';

describe('LocalStorageService', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockToken = 'test-token';

  beforeEach(() => {
    localStorage.clear();
  });

  describe('getAuthToken', () => {
    it('returns null when no token is set', () => {
      expect(LocalStorageService.getAuthToken()).toBeNull();
    });

    it('returns the token when set', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, mockToken);
      expect(LocalStorageService.getAuthToken()).toBe(mockToken);
    });
  });

  describe('setAuthToken', () => {
    it('sets the token in localStorage', () => {
      LocalStorageService.setAuthToken(mockToken);
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)).toBe(mockToken);
    });
  });

  describe('removeAuthToken', () => {
    it('removes the token from localStorage', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, mockToken);
      LocalStorageService.removeAuthToken();
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
    });
  });

  describe('getUser', () => {
    it('returns null when no user is set', () => {
      expect(LocalStorageService.getUser()).toBeNull();
    });

    it('returns the user when set', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(mockUser));
      expect(LocalStorageService.getUser()).toEqual(mockUser);
    });
  });

  describe('setUser', () => {
    it('sets the user in localStorage', () => {
      LocalStorageService.setUser(mockUser);
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      expect(storedUser).not.toBeNull();
      expect(JSON.parse(storedUser!)).toEqual(mockUser);
    });
  });

  describe('removeUser', () => {
    it('removes the user from localStorage', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(mockUser));
      LocalStorageService.removeUser();
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.USER)).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('clears all writespace-related data from localStorage', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, mockToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(mockUser));
      LocalStorageService.clearAll();
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.USER)).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no token is set', () => {
      expect(LocalStorageService.isAuthenticated()).toBe(false);
    });

    it('returns true when token is set', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, mockToken);
      expect(LocalStorageService.isAuthenticated()).toBe(true);
    });
  });
});