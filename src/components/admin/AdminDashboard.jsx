import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAdminStore } from '@/stores/admin.store';
import { Loader2, Users, FileText, Eye, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/admin/StatCard';

const AdminDashboard = ({ className, ...props }) => {
  const { stats, isLoading, error, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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

  if (!stats) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No statistics available
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`} {...props}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button asChild>
          <Link to="/posts/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-8 w-8 text-blue-500" />}
          trend="up"
        />
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={<FileText className="h-8 w-8 text-green-500" />}
          trend="up"
        />
        <StatCard
          title="Published Posts"
          value={stats.publishedPosts}
          icon={<Eye className="h-8 w-8 text-purple-500" />}
          trend="up"
        />
        <StatCard
          title="Draft Posts"
          value={stats.draftPosts}
          icon={<FileText className="h-8 w-8 text-yellow-500" />}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest users registered on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/users/${user.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent users
              </div>
            )}
            <div className="mt-6">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/users" className="flex items-center gap-2">
                  View All Users
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Latest posts created on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentPosts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        by {post.author.username}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/posts/${post.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent posts
              </div>
            )}
            <div className="mt-6">
              <Button variant="outline" size="sm" asChild>
                <Link to="/posts" className="flex items-center gap-2">
                  View All Posts
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
  className: PropTypes.string,
};

export { AdminDashboard };