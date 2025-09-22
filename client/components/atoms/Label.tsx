import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'block text-sm font-medium text-slate-700';

  const finalClassName = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <label className={finalClassName} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;