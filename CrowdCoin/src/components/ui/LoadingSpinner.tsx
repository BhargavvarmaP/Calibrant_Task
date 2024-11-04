import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-2 border-purple-500',
        {
          'w-4 h-4 border-2': size === 'sm',
          'w-6 h-6 border-2': size === 'md',
          'w-8 h-8 border-3': size === 'lg',
        },
        className
      )}
    />
  );
};

export default LoadingSpinner;