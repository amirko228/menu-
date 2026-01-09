import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

/**
 * Минималистичная профессиональная кнопка
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'font-medium rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900';

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700',
    secondary:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
  };

  const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-5 py-2.5 text-base min-h-[44px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin text-sm">⏳</span>
          <span className="text-sm">Загрузка...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

