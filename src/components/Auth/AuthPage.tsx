import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { useAuth } from '../../contexts/AuthContext';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'forgot'>('login');
  const { login, register, forgotPassword } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleSignup = async (userData: any) => {
    await register(userData);
  };

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email);
    setCurrentView('login'); // Return to login after sending reset email
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={() => setCurrentView('signup')}
            onSwitchToForgot={() => setCurrentView('forgot')}
            onLogin={handleLogin}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={() => setCurrentView('login')}
            onSignup={handleSignup}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm
            onSwitchToLogin={() => setCurrentView('login')}
            onForgotPassword={handleForgotPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      {renderCurrentView()}
    </AuthLayout>
  );
};