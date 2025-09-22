import React, { useState, useEffect } from 'react';
import { Button } from '../atoms';
import { InputField, PasswordField, Alert } from '../molecules';

export interface SignUpFormProps {
  onSubmit: (data: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  loading = false,
  error,
  success
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 8;
    const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0;

    setEmailError(email && !isEmailValid ? 'Please enter a valid email address' : null);
    setPasswordError(
      password && password.length < 8
        ? 'Password must be at least 8 characters long'
        : null
    );
    setConfirmPasswordError(
      confirmPassword && password !== confirmPassword
        ? 'Passwords do not match'
        : null
    );

    setIsFormValid(isEmailValid && isPasswordValid && isConfirmPasswordValid);
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    await onSubmit({ email, password, confirmPassword });
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
        placeholder="Create a strong password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError || undefined}
        showStrength
        required
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPasswordError || undefined}
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={!isFormValid}
      >
        Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;