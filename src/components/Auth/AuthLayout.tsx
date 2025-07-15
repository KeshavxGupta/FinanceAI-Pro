import React from 'react';
import { PieChart, TrendingUp, Shield, Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const features = [
    {
      icon: PieChart,
      title: 'Smart Analytics',
      description: 'AI-powered insights into your spending patterns and financial health'
    },
    {
      icon: TrendingUp,
      title: 'Goal Tracking',
      description: 'Set and achieve your financial goals with intelligent progress tracking'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with enterprise-grade encryption'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications and updates on your financial activities'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <PieChart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">FinanceAI Pro</h1>
              <p className="text-blue-100 text-sm">Smart Finance Management</p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Take Control of Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of users who have transformed their financial lives with our AI-powered platform.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-blue-200 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">$2.5B+</div>
              <div className="text-blue-200 text-sm">Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">4.9★</div>
              <div className="text-blue-200 text-sm">Rating</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 backdrop-blur-sm rounded-full animate-float"></div>
        <div className="absolute bottom-32 right-32 w-20 h-20 bg-yellow-300/20 backdrop-blur-sm rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-12 w-16 h-16 bg-purple-300/20 backdrop-blur-sm rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};