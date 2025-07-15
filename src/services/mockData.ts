import { Transaction, Budget, FinancialInsight, Goal, Investment, Bill, FinancialHealthScore } from '../types';
import { subDays, addDays, format } from 'date-fns';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3500,
    category: 'Salary',
    description: 'Monthly salary deposit',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'income',
    paymentMethod: 'bank_transfer',
    merchant: 'TechCorp Inc.',
    tags: ['salary', 'primary-income']
  },
  {
    id: '2',
    amount: 1200,
    category: 'Rent',
    description: 'Monthly apartment rent',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    type: 'expense',
    isRecurring: true,
    paymentMethod: 'bank_transfer',
    merchant: 'Property Management Co.',
    location: 'Downtown Apartment',
    tags: ['housing', 'fixed-expense']
  },
  {
    id: '3',
    amount: 85.50,
    category: 'Groceries',
    description: 'Weekly grocery shopping',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    type: 'expense',
    paymentMethod: 'card',
    merchant: 'Whole Foods Market',
    location: 'Main Street Store',
    tags: ['food', 'essentials']
  },
  {
    id: '4',
    amount: 45.00,
    category: 'Entertainment',
    description: 'Movie night with friends',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    type: 'expense',
    paymentMethod: 'card',
    merchant: 'AMC Theaters',
    tags: ['movies', 'social']
  },
  {
    id: '5',
    amount: 120.00,
    category: 'Utilities',
    description: 'Monthly electricity bill',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    type: 'expense',
    isRecurring: true,
    paymentMethod: 'bank_transfer',
    merchant: 'City Electric Company',
    tags: ['utilities', 'fixed-expense']
  },
  {
    id: '6',
    amount: 67.89,
    category: 'Transportation',
    description: 'Gas station fill-up',
    date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    type: 'expense',
    paymentMethod: 'card',
    merchant: 'Shell Gas Station',
    location: 'Highway 101',
    tags: ['fuel', 'transportation']
  },
  {
    id: '7',
    amount: 29.99,
    category: 'Subscriptions',
    description: 'Netflix monthly subscription',
    date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    type: 'expense',
    isRecurring: true,
    paymentMethod: 'card',
    merchant: 'Netflix Inc.',
    tags: ['streaming', 'entertainment']
  },
  {
    id: '8',
    amount: 250.00,
    category: 'Shopping',
    description: 'Winter clothing purchase',
    date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
    type: 'expense',
    paymentMethod: 'card',
    merchant: 'Nordstrom',
    tags: ['clothing', 'seasonal']
  },
  {
    id: '9',
    amount: 500.00,
    category: 'Investment',
    description: 'Monthly investment contribution',
    date: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
    type: 'expense',
    isRecurring: true,
    paymentMethod: 'bank_transfer',
    merchant: 'Vanguard',
    tags: ['investment', 'retirement']
  },
  {
    id: '10',
    amount: 75.00,
    category: 'Healthcare',
    description: 'Doctor visit copay',
    date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    type: 'expense',
    paymentMethod: 'card',
    merchant: 'City Medical Center',
    tags: ['health', 'medical']
  }
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Groceries',
    budgetAmount: 400,
    spentAmount: 285.50,
    period: 'monthly',
    alertThreshold: 80,
    rollover: true,
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')
  },
  {
    id: '2',
    category: 'Entertainment',
    budgetAmount: 200,
    spentAmount: 145.00,
    period: 'monthly',
    alertThreshold: 85,
    rollover: false,
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')
  },
  {
    id: '3',
    category: 'Transportation',
    budgetAmount: 300,
    spentAmount: 167.89,
    period: 'monthly',
    alertThreshold: 90,
    rollover: true,
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')
  },
  {
    id: '4',
    category: 'Shopping',
    budgetAmount: 350,
    spentAmount: 450.00,
    period: 'monthly',
    alertThreshold: 75,
    rollover: false,
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')
  },
  {
    id: '5',
    category: 'Dining Out',
    budgetAmount: 250,
    spentAmount: 89.50,
    period: 'monthly',
    alertThreshold: 80,
    rollover: true,
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')
  }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    description: '6 months of expenses for financial security',
    targetAmount: 15000,
    currentAmount: 8500,
    targetDate: format(addDays(new Date(), 365), 'yyyy-MM-dd'),
    category: 'emergency',
    priority: 'high',
    isActive: true,
    createdAt: format(subDays(new Date(), 90), 'yyyy-MM-dd')
  },
  {
    id: '2',
    title: 'European Vacation',
    description: 'Two-week trip to Europe next summer',
    targetAmount: 5000,
    currentAmount: 2200,
    targetDate: format(addDays(new Date(), 180), 'yyyy-MM-dd'),
    category: 'vacation',
    priority: 'medium',
    isActive: true,
    createdAt: format(subDays(new Date(), 60), 'yyyy-MM-dd')
  },
  {
    id: '3',
    title: 'House Down Payment',
    description: '20% down payment for first home',
    targetAmount: 50000,
    currentAmount: 12000,
    targetDate: format(addDays(new Date(), 730), 'yyyy-MM-dd'),
    category: 'house',
    priority: 'high',
    isActive: true,
    createdAt: format(subDays(new Date(), 120), 'yyyy-MM-dd')
  },
  {
    id: '4',
    title: 'New Car Fund',
    description: 'Reliable vehicle for daily commute',
    targetAmount: 25000,
    currentAmount: 5500,
    targetDate: format(addDays(new Date(), 450), 'yyyy-MM-dd'),
    category: 'car',
    priority: 'medium',
    isActive: true,
    createdAt: format(subDays(new Date(), 45), 'yyyy-MM-dd')
  }
];

export const mockInvestments: Investment[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 10,
    purchasePrice: 150.00,
    currentPrice: 175.50,
    purchaseDate: format(subDays(new Date(), 120), 'yyyy-MM-dd'),
    type: 'stock',
    sector: 'Technology'
  },
  {
    id: '2',
    symbol: 'VTSAX',
    name: 'Vanguard Total Stock Market Index',
    shares: 25,
    purchasePrice: 95.00,
    currentPrice: 102.30,
    purchaseDate: format(subDays(new Date(), 200), 'yyyy-MM-dd'),
    type: 'mutual_fund',
    sector: 'Diversified'
  },
  {
    id: '3',
    symbol: 'BTC',
    name: 'Bitcoin',
    shares: 0.5,
    purchasePrice: 45000.00,
    currentPrice: 52000.00,
    purchaseDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    type: 'crypto'
  },
  {
    id: '4',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 8,
    purchasePrice: 280.00,
    currentPrice: 310.25,
    purchaseDate: format(subDays(new Date(), 150), 'yyyy-MM-dd'),
    type: 'stock',
    sector: 'Technology'
  }
];

export const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Rent Payment',
    amount: 1200,
    dueDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), 'yyyy-MM-dd'),
    category: 'Housing',
    isRecurring: true,
    frequency: 'monthly',
    isPaid: false,
    paymentMethod: 'Bank Transfer'
  },
  {
    id: '2',
    name: 'Electric Bill',
    amount: 120,
    dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    category: 'Utilities',
    isRecurring: true,
    frequency: 'monthly',
    isPaid: false,
    paymentMethod: 'Auto Pay'
  },
  {
    id: '3',
    name: 'Car Insurance',
    amount: 180,
    dueDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    category: 'Insurance',
    isRecurring: true,
    frequency: 'monthly',
    isPaid: true,
    paymentMethod: 'Credit Card'
  },
  {
    id: '4',
    name: 'Internet Service',
    amount: 75,
    dueDate: format(addDays(new Date(), 8), 'yyyy-MM-dd'),
    category: 'Utilities',
    isRecurring: true,
    frequency: 'monthly',
    isPaid: false,
    paymentMethod: 'Auto Pay'
  }
];

export const mockFinancialHealth: FinancialHealthScore = {
  overall: 78,
  budgeting: 85,
  saving: 72,
  debt: 90,
  investing: 65,
  emergency: 70
};

export const mockInsights: FinancialInsight[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Budget Exceeded',
    description: 'You have exceeded your Shopping budget by $100 this month.',
    priority: 'high',
    category: 'Shopping',
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    actionable: true,
    action: 'Review recent purchases and adjust spending'
  },
  {
    id: '2',
    type: 'pattern',
    title: 'Weekend Spending Pattern',
    description: 'Your grocery spending increases by 15% on weekends.',
    priority: 'medium',
    category: 'Groceries',
    timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    actionable: true,
    action: 'Consider meal planning to reduce weekend impulse purchases'
  },
  {
    id: '3',
    type: 'tip',
    title: 'Subscription Optimization',
    description: 'You could save $45/month by switching to an annual plan for your streaming services.',
    priority: 'medium',
    category: 'Subscriptions',
    timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
    actionable: true,
    action: 'Review subscription plans and switch to annual billing'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Savings Milestone',
    description: 'Congratulations! You\'ve reached 50% of your emergency fund goal.',
    priority: 'low',
    timestamp: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
    actionable: false
  },
  {
    id: '5',
    type: 'forecast',
    title: 'Monthly Projection',
    description: 'Based on current trends, you\'re projected to save $720 this month.',
    priority: 'low',
    timestamp: format(subDays(new Date(), 4), 'yyyy-MM-dd HH:mm:ss'),
    actionable: false
  }
];