import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl shadow-lg',
          {
            'bg-white dark:bg-gray-800': !gradient,
            'bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm': gradient,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export default Card;