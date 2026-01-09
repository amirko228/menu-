import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}

/**
 * Минималистичная профессиональная карточка
 */
const Card = ({ children, onClick, className = '', interactive = false }: CardProps) => {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 p-4 transition-all';
  const interactiveStyles = interactive
    ? 'cursor-pointer hover:border-gray-300 hover:shadow-sm active:scale-[0.99] touch-manipulation'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      style={interactive ? { touchAction: 'manipulation' } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;

