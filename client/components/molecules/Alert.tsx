import React from 'react';
import { Icon } from '../atoms';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'p-4 rounded-xl border text-sm flex items-start';

  const variantClasses = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const iconMap = {
    success: 'check',
    error: 'exclamation',
    warning: 'exclamation',
    info: 'exclamation'
  } as const;

  const iconColorMap = {
    success: 'text-emerald-600',
    error: 'text-red-500',
    warning: 'text-yellow-600',
    info: 'text-blue-500'
  };

  const finalClassName = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={finalClassName} {...props}>
      <Icon
        name={iconMap[variant]}
        className={`${iconColorMap[variant]} mr-2 flex-shrink-0 mt-0.5`}
      />
      <div className="flex-1">
        {title && <div className="font-medium mb-1">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Alert;