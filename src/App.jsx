import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuthStore, authActions } from '@/stores/auth.store';
import { Toaster } from '@/components/ui/Toaster';
import { Navbar } from '@/components/ui/Navbar';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import BlogListPage from '@/pages/BlogListPage';
import BlogPostPage from '@/pages/BlogPostPage';
import BlogEditorPage from '@/pages/BlogEditorPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import UserManagementPage from '@/pages/UserManagementPage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <LandingPage />
        </main>
      </>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/posts',
    element: (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <BlogListPage />
        </main>
      </>
    ),
  },
  {
    path: '/posts/new',
    element: (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <BlogEditorPage />
        </main>
      </>
    ),
  },
  {
    path: '/posts/:id',
    element: (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <BlogPostPage />
        </main>
      </>
    ),
  },
  {
    path: '/posts/:id/edit',
    element: (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <BlogEditorPage />
        </main>
      </>
    ),
  },
  {
    path: '/admin',
    element: (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <AdminDashboardPage />
        </main>
      </>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <UserManagementPage />
        </main>
      </>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const App = () => {
  const { isLoading } = useAuthStore();

  useEffect(() => {
    authActions.checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;