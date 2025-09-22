import React, { useState, useEffect } from 'react';
import { Button } from '../atoms';
import { InputField, PasswordField, Alert } from '../molecules';

export interface SignInFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  onForgotPassword?: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  loading = false,
  error,
  success,
  onForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length > 0;

    setEmailError(email && !isEmailValid ? 'Please enter a valid email address' : null);
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Alert variant="success">
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError || undefined}
        iconName="email"
        required
      />

      <PasswordField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={!isFormValid}
      >
        Sign In
      </Button>

      {onForgotPassword && (
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={onForgotPassword}
          >
            Forgot your password?
          </Button>
        </div>
      )}
    </form>
  );
};

export default SignInForm;