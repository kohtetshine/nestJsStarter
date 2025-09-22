import React, { useState } from 'react';
import { Input, Label, ErrorMessage, Icon } from '../atoms';
import type { InputProps } from '../atoms';

export interface PasswordFieldProps extends Omit<InputProps, 'type' | 'error'> {
  label: string;
  error?: string;
  required?: boolean;
  showStrength?: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.match(/[a-z]/)) score++;
  if (password.match(/[A-Z]/)) score++;
  if (password.match(/[0-9]/)) score++;
  if (password.match(/[^a-zA-Z0-9]/)) score++;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];

  return {
    score,
    label: labels[score] || 'Very Weak',
    color: colors[score] || 'text-red-500'
  };
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  error,
  required = false,
  showStrength = false,
  value,
  id,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;

  const passwordStrength = showStrength && value ? getPasswordStrength(value as string) : null;

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <Input
        id={inputId}
        type={showPassword ? 'text' : 'password'}
        error={!!error}
        icon={<Icon name="lock" className="text-slate-400" />}
        endIcon={
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600"
            onClick={toggleVisibility}
            tabIndex={-1}
          >
            <Icon name={showPassword ? 'eye-off' : 'eye'} />
          </button>
        }
        value={value}
        {...inputProps}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {showStrength && value && passwordStrength && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>Password strength</span>
            <span className={passwordStrength.color}>{passwordStrength.label}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                passwordStrength.score <= 1 ? 'bg-red-500' :
                passwordStrength.score <= 2 ? 'bg-orange-500' :
                passwordStrength.score <= 3 ? 'bg-yellow-500' :
                passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordField;