import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Avatar } from './Avatar';
import { useAuthStore } from '@/stores/auth.store';
import { authActions } from '@/stores/auth.store';
import { APP_NAME } from '@/constants';
import { Home, FileText, Users, LogOut, Settings, LayoutDashboard } from 'lucide-react';

const Navbar = ({ className, ...props }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-4 w-4" />,
      roles: ['user', 'admin'],
    },
    {
      name: 'Posts',
      path: '/posts',
      icon: <FileText className="h-4 w-4" />,
      roles: ['user', 'admin'],
    },
    {
      name: 'Admin',
      path: '/admin',
      icon: <LayoutDashboard className="h-4 w-4" />,
      roles: ['admin'],
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users className="h-4 w-4" />,
      roles: ['admin'],
    },
  ];

  const filteredNavItems = navItems.filter(item =>
    isAuthenticated && item.roles.includes(user?.role || 'user')
  );

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
      {...props}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">{APP_NAME}</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {filteredNavItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to={item.path} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Avatar
                src={user?.avatar}
                alt={user?.username}
                role={user?.role}
                size="sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={authActions.logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login" className="flex items-center gap-2">
                <LogOut className="h-4 w-4 transform rotate-180" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  className: PropTypes.string,
};

export { Navbar };