import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useBlogStore } from '@/stores/blog.store';
import { useAuthStore } from '@/stores/auth.store';
import { Loader2, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DEFAULT_PAGINATION } from '@/constants';

const BlogList = ({ className, showFilters = true, ...props }) => {
  const { posts, publishedPosts, draftPosts, isLoading, error, fetchPosts, deletePost, publishPost, unpublishPost } = useBlogStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGINATION.page);
  const [limit, setLimit] = useState(DEFAULT_PAGINATION.limit);

  useEffect(() => {
    fetchPosts({
      page: currentPage,
      limit,
      sortBy: DEFAULT_PAGINATION.sortBy,
      sortOrder: DEFAULT_PAGINATION.sortOrder
    });
  }, [fetchPosts, currentPage, limit]);

  const handleDelete = async (id) => {
    const result = await deletePost(id);
    if (result.success) {
      fetchPosts({
        page: currentPage,
        limit,
        sortBy: DEFAULT_PAGINATION.sortBy,
        sortOrder: DEFAULT_PAGINATION.sortOrder
      });
    }
  };

  const handlePublish = async (id) => {
    await publishPost(id);
  };

  const handleUnpublish = async (id) => {
    await unpublishPost(id);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'published' && post.published) ||
                         (statusFilter === 'draft' && !post.published);
    return matchesSearch && matchesStatus;
  });

  const isAdmin = user?.role === 'admin';
  const canEdit = (post) => isAdmin || post.authorId === user?.id;

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No posts available
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <Select.Trigger className="w-full sm:w-40">
              <Select.Value placeholder="Filter by status" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All Posts</Select.Item>
              <Select.Item value="published">Published</Select.Item>
              <Select.Item value="draft">Drafts</Select.Item>
            </Select.Content>
          </Select>
        </div>
      )}

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {post.published ? (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </CardDescription>
                </div>
                {canEdit(post) && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    {post.published ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnpublish(post.id)}
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePublish(post.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.content}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/posts/${post.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="text-sm text-muted-foreground">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={filteredPosts.length < limit}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

BlogList.propTypes = {
  className: PropTypes.string,
  showFilters: PropTypes.bool,
};

export { BlogList };