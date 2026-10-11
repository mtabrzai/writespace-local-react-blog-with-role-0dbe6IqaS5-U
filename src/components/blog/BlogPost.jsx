import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlogStore } from '@/stores/blog.store';
import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Loader2, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, isLoading, error, fetchPostById, deletePost, publishPost, unpublishPost } = useBlogStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchPostById]);

  const handleDelete = async () => {
    if (!id) return;
    const result = await deletePost(id);
    if (result.success) {
      navigate('/posts');
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    await publishPost(id);
  };

  const handleUnpublish = async () => {
    if (!id) return;
    await unpublishPost(id);
  };

  const canEdit = isAuthenticated && (user?.role === 'admin' || post?.authorId === user?.id);

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
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Post not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2">
                <Avatar
                  src={post.author?.avatar}
                  alt={post.author?.username}
                  size="sm"
                />
                <div>
                  <span className="font-medium">{post.author?.username}</span>
                  <span className="text-muted-foreground mx-2">•</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                  {!post.published && (
                    <>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span className="text-sm inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    </>
                  )}
                </div>
              </CardDescription>
            </div>
            {canEdit && (
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
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                {post.published ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUnpublish}
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePublish}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-0 py-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
        </CardContent>
        <CardFooter className="px-0 pt-6">
          <Button variant="outline" asChild>
            <Link to="/posts">Back to Posts</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

BlogPost.propTypes = {
  className: PropTypes.string,
};

export { BlogPost };