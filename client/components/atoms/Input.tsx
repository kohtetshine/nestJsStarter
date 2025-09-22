import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  error = false,
  icon,
  endIcon,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-900 placeholder-slate-400 bg-white';

  const iconPadding = icon ? 'pl-12' : '';
  const endIconPadding = endIcon ? 'pr-12' : '';

  const stateClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500';

  const finalClassName = [
    baseClasses,
    iconPadding,
    endIconPadding,
    stateClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="relative">
      <input className={finalClassName} {...props} />
      {icon && (
        <div className="absolute left-4 top-3.5 w-5 h-5 text-slate-400">
          {icon}
        </div>
      )}
      {endIcon && (
        <div className="absolute right-4 top-3.5">
          {endIcon}
        </div>
      )}
    </div>
  );
};

export default Input;