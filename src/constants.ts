export const APP_NAME = 'writespace';

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'writespace:authToken',
  USER: 'writespace:user',
} as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  POSTS: {
    BASE: '/posts',
    PUBLISH: (id: string) => `/posts/${id}/publish`,
    UNPUBLISH: (id: string) => `/posts/${id}/unpublish`,
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
  },
} as const;

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@writespace.com',
  password: 'Admin@123!',
  username: 'admin',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful! Please login.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  POST_CREATED: 'Post created successfully.',
  POST_UPDATED: 'Post updated successfully.',
  POST_DELETED: 'Post deleted successfully.',
  POST_PUBLISHED: 'Post published successfully.',
  POST_UNPUBLISHED: 'Post unpublished successfully.',
} as const;