import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useBudgets } from '../../hooks/useBudgets';
import { useGoals } from '../../hooks/useGoals';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { useCurrency } from '../../contexts/CurrencyContext';

export const Analytics: React.FC = () => {
  const { transactions, getTotalByType } = useTransactions();
  const { budgets } = useBudgets();
  const { goals } = useGoals();
  const { formatCurrency, currency } = useCurrency();
  const [timeRange, setTimeRange] = useState('6months');
  const [isExporting, setIsExporting] = useState(false);

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case '3months':
        return { start: subMonths(now, 3), end: now };
      case '1year':
        return { start: subMonths(now, 12), end: now };
      default:
        return { start: subMonths(now, 6), end: now };
    }
  };

  const { start: startDate, end: endDate } = getDateRange();
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  // Prepare spending trend data
  const getMonthlyData = () => {
    const months = [];
    const monthCount = timeRange === '1year' ? 12 : timeRange === '3months' ? 3 : 6;
    
    for (let i = monthCount - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: format(date, 'MMM yyyy'),
        income,
        expenses,
        savings: income - expenses
      });
    }
    
    return months;
  };

  const monthlyData = getMonthlyData();

  // Enhanced category analysis
  const categoryData = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpenses = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);

  const categoryChartData = Object.entries(categoryData)
    .map(([category, amount]) => ({ 
      category, 
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const pieData = categoryChartData.slice(0, 8);

  // Daily spending pattern
  const getDailyPattern = () => {
    const dayTotals = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      const date = new Date(t.date);
      const dayName = format(date, 'EEE');
      if (dayTotals[dayName] !== undefined) {
        dayTotals[dayName] += t.amount;
        dayCounts[dayName]++;
      }
    });
    
    return Object.entries(dayTotals).map(([day, total]) => ({
      day,
      amount: dayCounts[day] > 0 ? total / dayCounts[day] : 0
    }));
  };

  const dailySpending = getDailyPattern();

  // Calculate metrics
  const totalExpensesAmount = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const avgDailySpending = totalExpensesAmount / (timeRange === '1year' ? 365 : timeRange === '3months' ? 90 : 180);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpensesAmount) / totalIncome) * 100 : 0;

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  // Enhanced pie chart label function
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, category, index }) => {
    // Only show labels for slices with more than 3% of the total
    if (percentage < 3) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // For larger slices (>15%), show both name and percentage inside
    if (percentage > 15) {
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize="12"
          fontWeight="600"
        >
          <tspan x={x} dy="-0.3em">{category}</tspan>
          <tspan x={x} dy="1.2em">{`${percentage.toFixed(1)}%`}</tspan>
        </text>
      );
    }

    // For medium slices (5-15%), show percentage only inside
    if (percentage > 5) {
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor="middle" 
          dominantBaseline="central"
          fontSize="11"
          fontWeight="600"
        >
          {`${percentage.toFixed(1)}%`}
        </text>
      );
    }

    // For smaller slices (3-5%), show percentage only
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="10"
        fontWeight="500"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  // Enhanced tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.category}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Amount: <span className="font-medium">{formatCurrency(data.amount)}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for other charts
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Prepare export data
      const exportData = {
        summary: {
          timeRange,
          totalIncome,
          totalExpenses: totalExpensesAmount,
          savingsRate: savingsRate.toFixed(2),
          avgDailySpending: avgDailySpending.toFixed(2),
          totalTransactions: filteredTransactions.length,
          exportDate: new Date().toISOString()
        },
        monthlyTrends: monthlyData,
        categoryBreakdown: categoryChartData,
        dailySpendingPattern: dailySpending,
        transactions: filteredTransactions.map(t => ({
          date: t.date,
          description: t.description,
          category: t.category,
          amount: t.amount,
          type: t.type,
          merchant: t.merchant || '',
          paymentMethod: t.paymentMethod || ''
        }))
      };

      // Create and download CSV files
      await downloadCSV(exportData);
      
      toast.success('Analytics data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadCSV = async (data: any) => {
    // Create summary CSV
    const summaryCSV = [
      ['Metric', 'Value'],
      ['Time Range', data.summary.timeRange],
      ['Total Income', formatCurrency(data.summary.totalIncome)],
      ['Total Expenses', formatCurrency(data.summary.totalExpenses)],
      ['Savings Rate', `${data.summary.savingsRate}%`],
      ['Average Daily Spending', formatCurrency(parseFloat(data.summary.avgDailySpending))],
      ['Total Transactions', data.summary.totalTransactions],
      ['Export Date', new Date(data.summary.exportDate).toLocaleString()]
    ].map(row => row.join(',')).join('\n');

    // Create monthly trends CSV
    const monthlyCSV = [
      ['Month', 'Income', 'Expenses', 'Savings'],
      ...data.monthlyTrends.map(m => [
        m.month, 
        formatCurrency(m.income).replace(',', ''), 
        formatCurrency(m.expenses).replace(',', ''), 
        formatCurrency(m.savings).replace(',', '')
      ])
    ].map(row => row.join(',')).join('\n');

    // Create category breakdown CSV
    const categoryCSV = [
      ['Category', 'Amount', 'Percentage'],
      ...data.categoryBreakdown.map(c => [
        c.category, 
        formatCurrency(c.amount).replace(',', ''), 
        `${c.percentage.toFixed(2)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    // Create transactions CSV
    const transactionsCSV = [
      ['Date', 'Description', 'Category', 'Amount', 'Type', 'Merchant', 'Payment Method'],
      ...data.transactions.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes for CSV
        t.category,
        formatCurrency(t.amount).replace(',', ''),
        t.type,
        `"${(t.merchant || '').replace(/"/g, '""')}"`,
        t.paymentMethod || ''
      ])
    ].map(row => row.join(',')).join('\n');

    // Download files
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    
    downloadFile(summaryCSV, `analytics-summary_${timestamp}.csv`);
    downloadFile(monthlyCSV, `monthly-trends_${timestamp}.csv`);
    downloadFile(categoryCSV, `category-breakdown_${timestamp}.csv`);
    downloadFile(transactionsCSV, `transactions_${timestamp}.csv`);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Financial Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights and trends from your financial data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Daily Spending</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(avgDailySpending)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${savingsRate >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              {savingsRate >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</p>
              <p className={`text-xl font-bold truncate ${
                savingsRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {filteredTransactions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Largest Expense</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {filteredTransactions.filter(t => t.type === 'expense').length > 0 
                  ? formatCurrency(Math.max(...filteredTransactions.filter(t => t.type === 'expense').map(t => t.amount)))
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Financial Trend ({timeRange.replace('months', ' Months').replace('1year', '1 Year')})
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${currency.symbol}${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `${currency.symbol}${(value / 1000).toFixed(0)}K`;
                  }
                  return formatCurrency(value);
                }}
                width={80}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Income"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Expenses"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Savings"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Category Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          {pieData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Enhanced Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {pieData.map((entry, index) => (
                  <div key={entry.category} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      {entry.category}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium ml-auto">
                      {entry.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Category Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Spending Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis 
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${currency.symbol}${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `${currency.symbol}${(value / 1000).toFixed(0)}K`;
                  }
                  return formatCurrency(value);
                }}
                width={80}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Amount']}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="amount" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Spending Pattern */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Average Daily Spending Pattern
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis 
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${currency.symbol}${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `${currency.symbol}${(value / 1000).toFixed(0)}K`;
                  }
                  return formatCurrency(value);
                }}
                width={80}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Average Spending']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <span>AI Financial Insights</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Spending Pattern
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              {dailySpending.length > 0 && Math.max(...dailySpending.map(d => d.amount)) > Math.min(...dailySpending.map(d => d.amount)) * 1.5
                ? "You spend significantly more on weekends compared to weekdays"
                : "Your spending is fairly consistent throughout the week"
              }
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-green-900 dark:text-green-300">
              Savings Opportunity
            </p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              {categoryChartData.length > 0
                ? `Your top spending category is ${categoryChartData[0].category}. Consider optimizing expenses here.`
                : "Track more transactions to identify savings opportunities"
              }
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Financial Health
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
              {savingsRate >= 20
                ? "Excellent! You're saving more than 20% of your income"
                : savingsRate >= 10
                ? "Good savings rate. Consider increasing to 20% if possible"
                : "Focus on increasing your savings rate to at least 10%"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};