import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-2xl';

  const variantClasses = {
    default: 'border border-slate-200',
    elevated: 'shadow-xl border border-slate-200',
    outlined: 'border-2 border-slate-300'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const finalClassName = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  );
};

export default Card;