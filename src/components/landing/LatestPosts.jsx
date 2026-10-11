import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useBlogStore } from '@/stores/blog.store';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const LatestPosts = ({ className, limit = 3, ...props }) => {
  const { publishedPosts, isLoading, error, fetchPosts } = useBlogStore();

  useEffect(() => {
    fetchPosts({ limit });
  }, [fetchPosts, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        Failed to load latest posts
      </div>
    );
  }

  if (publishedPosts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No posts available
      </div>
    );
  }

  const displayedPosts = publishedPosts.slice(0, limit);

  return (
    <section className={`py-12 sm:py-16 ${className}`} {...props}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Latest Posts
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/posts" className="flex items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.content}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/posts/${post.id}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

LatestPosts.propTypes = {
  className: PropTypes.string,
  limit: PropTypes.number,
};

export { LatestPosts };