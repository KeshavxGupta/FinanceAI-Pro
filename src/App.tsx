import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Transactions } from './components/Transactions/Transactions';
import { Analytics } from './components/Analytics/Analytics';
import { Budgets } from './components/Budgets/Budgets';
import { Goals } from './components/Goals/Goals';
import { Investments } from './components/Investments/Investments';
import { Bills } from './components/Bills/Bills';
import { FinancialHealth } from './components/FinancialHealth/FinancialHealth';
import { Chatbot } from './components/Chatbot/Chatbot';
import { Profile } from './components/Profile/Profile';
import { Settings } from './components/Settings/Settings';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'budgets':
        return <Budgets />;
      case 'goals':
        return <Goals />;
      case 'investments':
        return <Investments />;
      case 'bills':
        return <Bills />;
      case 'health':
        return <FinancialHealth />;
      case 'chatbot':
        return <Chatbot />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading FinanceAI Pro...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
            }}
          />
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;