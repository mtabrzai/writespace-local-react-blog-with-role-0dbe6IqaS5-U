import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { useAdminStore } from '@/stores/admin.store';
import { LocalStorageService } from '@/services/localStorage.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

vi.mock('axios');
vi.mock('@/services/localStorage.service');

const mockStats = {
  totalUsers: 10,
  totalPosts: 25,
  publishedPosts: 20,
  draftPosts: 5,
  recentUsers: [
    {
      id: '1',
      username: 'recentuser',
      email: 'recent@example.com',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2023-01-15T00:00:00Z',
    },
  ],
  recentPosts: [
    {
      id: '1',
      title: 'Recent Post',
      createdAt: '2023-01-15T00:00:00Z',
      author: {
        id: '1',
        username: 'postauthor',
      },
    },
  ],
};

const mockUsers = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'testuser2',
    email: 'test2@example.com',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

const mockToken = 'test-token';

describe('admin store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminStore.getState().clearError();
    LocalStorageService.clearAll();
    vi.mocked(LocalStorageService.getAuthToken).mockReturnValue(mockToken);
  });

  describe('fetchStats', () => {
    it('should fetch stats successfully and update state', async () => {
      const mockResponse = {
        data: {
          data: mockStats,
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      await useAdminStore.getState().fetchStats();

      const state = useAdminStore.getState();
      expect(state.stats).toEqual(mockStats);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetch stats error', async () => {
      const errorMessage = 'Failed to fetch stats';
      vi.mocked(axios.get).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await useAdminStore.getState().fetchStats();

      const state = useAdminStore.getState();
      expect(state.error).toEqual(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    it('should handle network error during fetch stats', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

      await useAdminStore.getState().fetchStats();

      const state = useAdminStore.getState();
      expect(state.error).toEqual(ERROR_MESSAGES.NETWORK_ERROR);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchUsers', () => {
    it('should fetch users successfully and update state', async () => {
      const mockResponse = {
        data: {
          data: mockUsers,
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      await useAdminStore.getState().fetchUsers();

      const state = useAdminStore.getState();
      expect(state.users).toEqual(mockUsers);
      expect(state.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetch users error', async () => {
      const errorMessage = 'Failed to fetch users';
      vi.mocked(axios.get).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await useAdminStore.getState().fetchUsers();

      const state = useAdminStore.getState();
      expect(state.error).toEqual(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    it('should handle network error during fetch users', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

      await useAdminStore.getState().fetchUsers();

      const state = useAdminStore.getState();
      expect(state.error).toEqual(ERROR_MESSAGES.NETWORK_ERROR);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchUserById', () => {
    it('should fetch user by id successfully', async () => {
      const mockResponse = {
        data: {
          data: mockUsers[0],
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const user = await useAdminStore.getState().fetchUserById('1');

      expect(user).toEqual(mockUsers[0]);
      expect(useAdminStore.getState().isLoading).toBe(false);
      expect(useAdminStore.getState().error).toBeNull();
    });

    it('should handle fetch user by id error', async () => {
      const errorMessage = 'User not found';
      vi.mocked(axios.get).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const user = await useAdminStore.getState().fetchUserById('1');

      expect(user).toBeNull();
      expect(useAdminStore.getState().error).toEqual(errorMessage);
      expect(useAdminStore.getState().isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully and update state', async () => {
      const updatedUserData = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      const mockResponse = {
        data: {
          data: {
            ...mockUsers[0],
            ...updatedUserData,
            updatedAt: '2023-01-03T00:00:00Z',
          },
        },
      };

      vi.mocked(axios.patch).mockResolvedValue(mockResponse);

      const result = await useAdminStore.getState().updateUser('1', updatedUserData);

      const state = useAdminStore.getState();
      expect(state.users[0].username).toBe('updateduser');
      expect(state.users[0].email).toBe('updated@example.com');
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.POST_UPDATED });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle update user error', async () => {
      const updatedUserData = {
        username: 'updateduser',
      };

      const errorMessage = 'Failed to update user';
      vi.mocked(axios.patch).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const result = await useAdminStore.getState().updateUser('1', updatedUserData);

      expect(result).toEqual({ success: false, message: errorMessage });
      expect(useAdminStore.getState().error).toEqual(errorMessage);
      expect(useAdminStore.getState().isLoading).toBe(false);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully and update state', async () => {
      vi.mocked(axios.delete).mockResolvedValue({});

      const result = await useAdminStore.getState().deleteUser('1');

      const state = useAdminStore.getState();
      expect(state.users.length).toBe(1);
      expect(state.users[0].id).toBe('2');
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.POST_DELETED });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle delete user error', async () => {
      const errorMessage = 'Failed to delete user';
      vi.mocked(axios.delete).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const result = await useAdminStore.getState().deleteUser('1');

      expect(result).toEqual({ success: false, message: errorMessage });
      expect(useAdminStore.getState().error).toEqual(errorMessage);
      expect(useAdminStore.getState().isLoading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      useAdminStore.getState().setState({ error: 'Some error' });
      useAdminStore.getState().clearError();
      expect(useAdminStore.getState().error).toBeNull();
    });
  });
});