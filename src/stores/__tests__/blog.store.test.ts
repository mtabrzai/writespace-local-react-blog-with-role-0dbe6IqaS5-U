import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { useBlogStore } from '@/stores/blog.store';
import { LocalStorageService } from '@/services/localStorage.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

vi.mock('axios');
vi.mock('@/services/localStorage.service');

const mockPosts = [
  {
    id: '1',
    title: 'First Post',
    content: 'Content of first post',
    authorId: '1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    published: true,
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'Content of second post',
    authorId: '1',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    published: false,
  },
];

const mockToken = 'test-token';

describe('blog store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBlogStore.getState().clearError();
    LocalStorageService.clearAll();
    vi.mocked(LocalStorageService.getAuthToken).mockReturnValue(mockToken);
  });

  describe('fetchPosts', () => {
    it('should fetch posts successfully and update state', async () => {
      const mockResponse = {
        data: {
          data: mockPosts,
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      await useBlogStore.getState().fetchPosts();

      const state = useBlogStore.getState();
      expect(state.posts).toEqual(mockPosts);
      expect(state.publishedPosts).toEqual([mockPosts[0]]);
      expect(state.draftPosts).toEqual([mockPosts[1]]);
      expect(state.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetch posts error', async () => {
      const errorMessage = 'Failed to fetch posts';
      vi.mocked(axios.get).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await useBlogStore.getState().fetchPosts();

      const state = useBlogStore.getState();
      expect(state.error).toEqual(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    it('should handle network error during fetch posts', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

      await useBlogStore.getState().fetchPosts();

      const state = useBlogStore.getState();
      expect(state.error).toEqual(ERROR_MESSAGES.NETWORK_ERROR);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchPostById', () => {
    it('should fetch post by id successfully', async () => {
      const mockResponse = {
        data: {
          data: mockPosts[0],
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const post = await useBlogStore.getState().fetchPostById('1');

      expect(post).toEqual(mockPosts[0]);
      expect(useBlogStore.getState().isLoading).toBe(false);
      expect(useBlogStore.getState().error).toBeNull();
    });

    it('should handle fetch post by id error', async () => {
      const errorMessage = 'Post not found';
      vi.mocked(axios.get).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const post = await useBlogStore.getState().fetchPostById('1');

      expect(post).toBeNull();
      expect(useBlogStore.getState().error).toEqual(errorMessage);
      expect(useBlogStore.getState().isLoading).toBe(false);
    });
  });

  describe('createPost', () => {
    it('should create post successfully and update state', async () => {
      const newPost = {
        title: 'New Post',
        content: 'Content of new post',
        authorId: '1',
      };

      const mockResponse = {
        data: {
          data: {
            ...newPost,
            id: '3',
            createdAt: '2023-01-03T00:00:00Z',
            updatedAt: '2023-01-03T00:00:00Z',
            published: false,
          },
        },
      };

      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      const result = await useBlogStore.getState().createPost(newPost);

      const state = useBlogStore.getState();
      expect(state.posts[0].id).toBe('3');
      expect(state.draftPosts[0].id).toBe('3');
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.POST_CREATED });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle create post error', async () => {
      const newPost = {
        title: 'New Post',
        content: 'Content of new post',
        authorId: '1',
      };

      const errorMessage = 'Failed to create post';
      vi.mocked(axios.post).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const result = await useBlogStore.getState().createPost(newPost);

      expect(result).toEqual({ success: false, message: errorMessage });
      expect(useBlogStore.getState().error).toEqual(errorMessage);
      expect(useBlogStore.getState().isLoading).toBe(false);
    });
  });

  describe('updatePost', () => {
    it('should update post successfully and update state', async () => {
      const updatedPost = {
        title: 'Updated Post',
        content: 'Updated content',
      };

      const mockResponse = {
        data: {
          data: {
            ...mockPosts[0],
            ...updatedPost,
            updatedAt: '2023-01-03T00:00:00Z',
          },
        },
      };

      vi.mocked(axios.patch).mockResolvedValue(mockResponse);

      const result = await useBlogStore.getState().updatePost('1', updatedPost);

      const state = useBlogStore.getState();
      expect(state.posts[0].title).toBe('Updated Post');
      expect(state.publishedPosts[0].title).toBe('Updated Post');
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.POST_UPDATED });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle update post error', async () => {
      const updatedPost = {
        title: 'Updated Post',
        content: 'Updated content',
      };

      const errorMessage = 'Failed to update post';
      vi.mocked(axios.patch).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const result = await useBlogStore.getState().updatePost('1', updatedPost);

      expect(result).toEqual({ success: false, message: errorMessage });
      expect(useBlogStore.getState().error).toEqual(errorMessage);
      expect(useBlogStore.getState().isLoading).toBe(false);
    });
  });

  describe('deletePost', () => {
    it('should delete post successfully and update state', async () => {
      vi.mocked(axios.delete).mockResolvedValue({});

      const result = await useBlogStore.getState().deletePost('1');

      const state = useBlogStore.getState();
      expect(state.posts.length).toBe(1);
      expect(state.publishedPosts.length).toBe(0);
      expect(state.draftPosts.length).toBe(1);
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.POST_DELETED });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle delete post error', async () => {
      const errorMessage = 'Failed to delete post';
      vi.mocked(axios.delete).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const result = await useBlogStore.getState().deletePost('1');

      expect(result).toEqual({ success: false, message: errorMessage });
      expect(useBlogStore.getState().error).toEqual(errorMessage);
      expect(useBlogStore.getState().isLoading).toBe(false);
    });
  });

  describe('publishPost', () => {
    it('should publish post successfully and update state', async () => {
      const mockResponse = {
        data: {
          data: {
            ...mockPosts[1],
            published: true,
            updatedAt: '2023-01-03T00:00:00Z',
          },
        },
      };

      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      const result = await useBlogStore.getState().publishPost('2');

      const state = useBlogStore.getState();
      expect(state.posts[1].published).toBe(true);
      expect(state.publishedPosts.length).toBe(2);
      expect(state.draftPosts.length).toBe(0);
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.POST_PUBLISHED });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle publish post error', async () => {
      const errorMessage = 'Failed to publish post';
      vi.mocked(axios.post).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const result = await useBlogStore.getState().publishPost('2');

      expect(result).toEqual({ success: false, message: errorMessage });
      expect(useBlogStore.getState().error).toEqual(errorMessage);
      expect(useBlogStore.getState().isLoading).toBe(false);
    });
  });

  describe('unpublishPost', () => {
    it('should unpublish post successfully and update state', async () => {
      const mockResponse = {
        data: {
          data: {
            ...mockPosts[0],
            published: false,
            updatedAt: '2023-01-03T00:00:00Z',
          },
        },
      };

      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      const result = await useBlogStore.getState().unpublishPost('1');

      const state = useBlogStore.getState();
      expect(state.posts[0].published).toBe(false);
      expect(state.publishedPosts.length).toBe(0);
      expect(state.draftPosts.length).toBe(2);
      expect(result).toEqual({ success: true, message: SUCCESS_MESSAGES.POST_UNPUBLISHED });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle unpublish post error', async () => {
      const errorMessage = 'Failed to unpublish post';
      vi.mocked(axios.post).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const result = await useBlogStore.getState().unpublishPost('1');

      expect(result).toEqual({ success: false, message: errorMessage });
      expect(useBlogStore.getState().error).toEqual(errorMessage);
      expect(useBlogStore.getState().isLoading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      useBlogStore.getState().setState({ error: 'Some error' });
      useBlogStore.getState().clearError();
      expect(useBlogStore.getState().error).toBeNull();
    });
  });
});