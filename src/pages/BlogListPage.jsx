import React from 'react';
import { BlogList } from '@/components/blog/BlogList';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthRoute } from '@/components/auth/AuthRoute';

const BlogListPage = () => {
  return (
    <AuthRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <Button asChild>
            <Link to="/posts/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
        <BlogList />
      </div>
    </AuthRoute>
  );
};

export default BlogListPage;