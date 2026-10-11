import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';
import { useBlogStore } from '@/stores/blog.store';
import { useNavigate, useParams } from 'react-router-dom';

const blogPostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(100, { message: 'Title must be at most 100 characters' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters' }),
});

const BlogEditor = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createPost, updatePost, fetchPostById, isLoading, error } = useBlogStore();

  const form = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      const loadPost = async () => {
        const post = await fetchPostById(id);
        if (post) {
          form.reset({
            title: post.title,
            content: post.content,
          });
        }
      };
      loadPost();
    }
  }, [isEditMode, id, fetchPostById, form]);

  const onSubmit = async (values) => {
    try {
      let result;
      if (isEditMode && id) {
        result = await updatePost(id, values);
      } else {
        result = await createPost(values);
      }

      if (result.success) {
        navigate('/posts');
      }
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Post' : 'Create New Post'}</CardTitle>
          <CardDescription>
            {isEditMode ? 'Update your post details' : 'Share your thoughts with the world'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your post content here..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0 pt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/posts')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditMode ? 'Update Post' : 'Publish Post'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

BlogEditor.propTypes = {
  isEditMode: PropTypes.bool,
};

export { BlogEditor };