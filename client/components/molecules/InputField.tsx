import React from 'react';
import { Input, Label, ErrorMessage, Icon } from '../atoms';
import type { InputProps } from '../atoms';

export interface InputFieldProps extends Omit<InputProps, 'error'> {
  label: string;
  error?: string;
  required?: boolean;
  iconName?: 'email' | 'lock';
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  required = false,
  iconName,
  id,
  ...inputProps
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <Input
        id={inputId}
        error={!!error}
        icon={iconName ? <Icon name={iconName} className="text-slate-400" /> : undefined}
        {...inputProps}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default InputField;