import React, { useState } from 'react';
import { Card, Button, Icon } from '../atoms';
import { TabNavigation, Alert } from '../molecules';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import type { Tab } from '../molecules/TabNavigation';

export interface AuthContainerProps {
  onSignIn: (data: { email: string; password: string }) => Promise<void>;
  onSignUp: (data: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  onForgotPassword?: () => void;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  signedInUser?: { email: string } | null;
  onSignOut?: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  onSignIn,
  onSignUp,
  onForgotPassword,
  loading = false,
  error,
  success,
  signedInUser,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  const tabs: Tab[] = [
    { key: 'signin', label: 'Sign In' },
    { key: 'signup', label: 'Sign Up' }
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as 'signin' | 'signup');
  };

  if (signedInUser) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center space-y-6">
          <Alert variant="success" title="Welcome back!">
            {signedInUser.email}
          </Alert>
          {onSignOut && (
            <Button
              variant="secondary"
              fullWidth
              onClick={onSignOut}
            >
              Sign Out
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="p-8">
        {activeTab === 'signin' ? (
          <SignInForm
            onSubmit={onSignIn}
            loading={loading}
            error={error}
            success={success}
            onForgotPassword={onForgotPassword}
          />
        ) : (
          <SignUpForm
            onSubmit={onSignUp}
            loading={loading}
            error={error}
            success={success}
          />
        )}
      </div>
    </Card>
  );
};

export default AuthContainer;