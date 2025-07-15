import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  Target, 
  MessageCircle, 
  Settings, 
  User,
  Moon,
  Sun,
  TrendingUp,
  Calendar,
  Shield,
  Briefcase,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'budgets', label: 'Budgets', icon: Target },
  { id: 'goals', label: 'Goals', icon: TrendingUp },
  { id: 'investments', label: 'Investments', icon: Briefcase },
  { id: 'bills', label: 'Bills', icon: Calendar },
  { id: 'health', label: 'Financial Health', icon: Shield },
  { id: 'chatbot', label: 'AI Assistant', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = sidebarRef.current;
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (isMobileMenuOpen && sidebar && menuButton && 
          !sidebar.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
    
    // Scroll to the selected item in the sidebar
    if (navRef.current) {
      const activeElement = navRef.current.querySelector(`[data-tab="${tab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Mobile menu toggle button
  const MobileMenuButton = () => (
    <button
      id="mobile-menu-button"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      ) : (
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar Container */}
      <div 
        ref={sidebarRef}
        id="mobile-sidebar"
        className={`${
          isMobile 
            ? `fixed inset-y-0 left-0 z-50 w-[280px] transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
            : 'relative w-72'
        } flex flex-col h-full`}
      >
        <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinanceAI Pro
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Smart Finance Management
                </p>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Section - Scrollable */}
          <div 
            ref={navRef}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  data-tab={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-gray-900 dark:hover:text-white hover:scale-102'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${
                    activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  {activeTab === item.id ? (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : (
                    <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Section */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group"
            >
              {isDark ? (
                <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              )}
              <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Sign Out</span>
            </button>
            
            <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  System Status
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All systems operational
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};