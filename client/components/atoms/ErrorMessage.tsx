import React from 'react';

export interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  children,
  className = ''
}) => {
  const baseClasses = 'text-red-500 text-xs mt-1';
  const finalClassName = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <p className={finalClassName}>
      {children}
    </p>
  );
};

export default ErrorMessage;