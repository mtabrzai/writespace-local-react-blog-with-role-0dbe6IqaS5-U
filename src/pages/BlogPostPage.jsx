import React from 'react';
import { BlogPost } from '@/components/blog/BlogPost';
import { AuthRoute } from '@/components/auth/AuthRoute';

const BlogPostPage = () => {
  return (
    <AuthRoute>
      <BlogPost />
    </AuthRoute>
  );
};

export default BlogPostPage;