import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { User, ShieldCheck } from 'lucide-react';

const Avatar = React.forwardRef(({ className, src, alt, role = 'user', size = 'default', ...props }, ref) => {
  const sizeClasses = {
    default: 'h-10 w-10',
    sm: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const iconSize = {
    default: 20,
    sm: 16,
    lg: 24,
    xl: 32,
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-secondary',
        sizeClasses[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src ? (
        <img
          className="h-full w-full object-cover"
          src={src}
          alt={alt || 'User avatar'}
        />
      ) : (
        <>
          {role === 'admin' ? (
            <ShieldCheck className="h-5 w-5 text-primary" size={iconSize[size]} />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" size={iconSize[size]} />
          )}
        </>
      )}
      {role === 'admin' && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          <ShieldCheck className="h-3 w-3" />
        </span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
  role: PropTypes.oneOf(['user', 'admin']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'xl']),
};

export { Avatar };