import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Plus, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminStore } from '@/stores/admin.store';
import { Avatar } from '@/components/ui/Avatar';
import { DEFAULT_PAGINATION } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';
import { formatDistanceToNow } from 'date-fns';

const UserManagement = ({ className, ...props }) => {
  const { users, isLoading, error, pagination, fetchUsers, deleteUser } = useAdminStore();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers({
      page: DEFAULT_PAGINATION.page,
      limit: DEFAULT_PAGINATION.limit,
      sortBy: DEFAULT_PAGINATION.sortBy,
      sortOrder: DEFAULT_PAGINATION.sortOrder
    });
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    const result = await deleteUser(id);
    if (result.success) {
      fetchUsers({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: DEFAULT_PAGINATION.sortBy,
        sortOrder: DEFAULT_PAGINATION.sortOrder
      });
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsers({
      page: newPage,
      limit: pagination.limit,
      sortBy: DEFAULT_PAGINATION.sortBy,
      sortOrder: DEFAULT_PAGINATION.sortOrder
    });
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && users.length === 0) {
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

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`} {...props}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <Button asChild>
          <a href="/admin/users/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New User
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage all users on the platform
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-muted-foreground">User</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b last:border-b-0 hover:bg-accent/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={user.avatar}
                              alt={user.username}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium">{user.username}</p>
                              {user.id === currentUser?.id && (
                                <p className="text-xs text-muted-foreground">You</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                            {user.email}
                          </a>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            disabled={user.id === currentUser?.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {pagination.total} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

UserManagement.propTypes = {
  className: PropTypes.string,
};

export { UserManagement };