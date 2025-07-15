export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  tags?: string[];
  location?: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'check' | 'automatic_payment' | 'mobile_payment' | 'crypto';
  merchant?: string;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  alertThreshold: number;
  rollover?: boolean;
  startDate: string;
  endDate: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'emergency' | 'vacation' | 'house' | 'car' | 'education' | 'retirement' | 'wedding' | 'business' | 'debt' | 'tech' | 'health' | 'gift' | 'investment' | 'travel' | 'hobby' | 'other';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: string;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  type: 'stock' | 'bond' | 'etf' | 'crypto' | 'mutual_fund' | 'reit' | 'commodity' | 'forex' | 'option' | 'futures';
  sector?: string;
  exchange?: string;
  dividendYield?: number;
  notes?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'biannually' | 'yearly';
  isPaid: boolean;
  paymentMethod?: string;
  notes?: string;
  accountNumber?: string;
  website?: string;
  autoPayEnabled?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    currency: string;
    dateFormat: string;
    notifications: boolean;
    darkMode: boolean;
  };
  financialProfile: {
    monthlyIncome: number;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    financialGoals: string[];
  };
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  type?: 'text' | 'chart' | 'insight';
}

export interface FinancialInsight {
  id: string;
  type: 'pattern' | 'tip' | 'forecast' | 'alert' | 'achievement';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  timestamp: string;
  actionable?: boolean;
  action?: string;
}

export interface FinancialHealthScore {
  overall: number;
  budgeting: number;
  saving: number;
  debt: number;
  investing: number;
  emergency: number;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface NotificationSettings {
  budgetAlerts: boolean;
  billReminders: boolean;
  goalMilestones: boolean;
  weeklyReports: boolean;
  aiInsights: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications?: boolean;
  browserNotifications?: boolean;
  notificationTime?: string;
  digestFrequency?: 'daily' | 'weekly' | 'monthly';
}

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketingEmails: boolean;
  profileVisibility: 'private' | 'friends' | 'public';
  dataRetention: 'standard' | 'extended' | 'minimal';
  thirdPartyIntegrations: boolean;
}

export interface AccountSettings {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan' | 'other';
  balance: number;
  institution: string;
  accountNumber: string;
  routingNumber?: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  nextDate: string;
  endDate?: string;
  isActive: boolean;
  paymentMethod?: string;
  notes?: string;
}

export interface TaxDocument {
  id: string;
  name: string;
  type: 'W2' | 'W4' | '1099' | '1098' | 'K1' | 'other';
  year: number;
  dateUploaded: string;
  fileUrl: string;
  notes?: string;
}

export interface FinancialReport {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    income: number;
    expenses: number;
    savings: number;
    savingsRate: number;
  };
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
  generatedAt: string;
  notes?: string;
}