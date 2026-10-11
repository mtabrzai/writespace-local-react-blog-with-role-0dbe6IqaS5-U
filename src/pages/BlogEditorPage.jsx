import React from 'react';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { AuthRoute } from '@/components/auth/AuthRoute';
import { useParams } from 'react-router-dom';

const BlogEditorPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  return (
    <AuthRoute>
      <BlogEditor isEditMode={isEditMode} />
    </AuthRoute>
  );
};

export default BlogEditorPage;