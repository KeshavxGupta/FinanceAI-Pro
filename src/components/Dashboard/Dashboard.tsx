import React from 'react';
import { StatsCard } from './StatsCard';
import { RecentTransactions } from './RecentTransactions';
import { DollarSign, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from 'recharts';
import { useTransactions } from '../../hooks/useTransactions';
import { useBudgets } from '../../hooks/useBudgets';
import { useGoals } from '../../hooks/useGoals';
import { useCurrency } from '../../contexts/CurrencyContext';

export const Dashboard: React.FC = () => {
  const { transactions, getTotalByType } = useTransactions();
  const { budgets, getActiveBudgets } = useBudgets();
  const { goals, getActiveGoals, getCompletedGoals } = useGoals();
  const { formatCurrency, currency } = useCurrency();

  // Calculate current month data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

  const currentMonthTransactions = transactions.filter(t => 
    t.date >= firstDayOfMonth && t.date <= lastDayOfMonth
  );

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  // Calculate budget status
  const activeBudgets = getActiveBudgets();
  const budgetsWithSpending = activeBudgets.map(budget => {
    const spent = currentMonthTransactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...budget,
      spentAmount: spent,
      utilization: budget.budgetAmount > 0 ? (spent / budget.budgetAmount) * 100 : 0
    };
  });

  const overBudgetCount = budgetsWithSpending.filter(b => b.utilization > 100).length;
  const nearLimitCount = budgetsWithSpending.filter(b => b.utilization > b.alertThreshold && b.utilization <= 100).length;

  // Goal statistics
  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();
  const totalGoalProgress = activeGoals.length > 0 
    ? activeGoals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / activeGoals.length * 100
    : 0;

  // Prepare chart data
  const categoryData = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpensesSum = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);

  const pieData = Object.entries(categoryData)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalExpensesSum > 0 ? (value / totalExpensesSum) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 categories

  // Monthly trend data (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const monthTransactions = transactions.filter(t => t.date >= monthStart && t.date <= monthEnd);
    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    monthlyData.push({
      name: date.toLocaleDateString('en-US', { month: 'short' }),
      income,
      expenses,
      savings: income - expenses
    });
  }

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  // Custom label function for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name, index }) => {
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
          <tspan x={x} dy="-0.3em">{name}</tspan>
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

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Amount: <span className="font-medium">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-blue-100 text-base sm:text-lg">
            Here's your financial overview for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <DollarSign className="w-24 h-24 sm:w-32 sm:h-32" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <StatsCard
          title="Monthly Balance"
          value={formatCurrency(balance)}
          change={balance >= 0 ? `+${formatCurrency(balance)}` : `-${formatCurrency(Math.abs(balance))}`}
          changeType={balance >= 0 ? "positive" : "negative"}
          icon={DollarSign}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Monthly Income"
          value={formatCurrency(totalIncome)}
          change={`${currentMonthTransactions.filter(t => t.type === 'income').length} trans.`}
          changeType="positive"
          icon={TrendingUp}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatsCard
          title="Monthly Expenses"
          value={formatCurrency(totalExpenses)}
          change={`${currentMonthTransactions.filter(t => t.type === 'expense').length} trans.`}
          changeType="negative"
          icon={TrendingDown}
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
        <StatsCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          change={savingsRate >= 20 ? "Excellent!" : savingsRate >= 10 ? "Good" : "Needs work"}
          changeType={savingsRate >= 10 ? "positive" : "negative"}
          icon={Target}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Quick Alerts */}
      {(overBudgetCount > 0 || nearLimitCount > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Budget Alerts</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overBudgetCount > 0 && (
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-red-500" />
                  <span className="font-medium text-red-900 dark:text-red-100 text-sm sm:text-base">
                    {overBudgetCount} budget{overBudgetCount > 1 ? 's' : ''} exceeded
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1">
                  Review your spending in these categories
                </p>
              </div>
            )}
            {nearLimitCount > 0 && (
              <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500" />
                  <span className="font-medium text-yellow-900 dark:text-yellow-100 text-sm sm:text-base">
                    {nearLimitCount} budget{nearLimitCount > 1 ? 's' : ''} near limit
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Consider adjusting your spending
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Enhanced Expense Categories Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense Categories This Month
          </h3>
          {pieData.length > 0 ? (
            <div className="space-y-4">
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
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
              </div>
              
              {/* Legend for smaller categories */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      {entry.name}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium ml-auto">
                      {entry.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No expense data for this month</p>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            6-Month Financial Trend
          </h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${currency.symbol}${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${currency.symbol}${(value / 1000).toFixed(0)}K`;
                    }
                    return formatCurrency(value);
                  }}
                  width={60}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
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
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Goals and Budgets Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Goals Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span>Goals Progress</span>
          </h3>
          {activeGoals.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">Overall Progress</p>
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">{activeGoals.length} active goals</p>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalGoalProgress.toFixed(1)}%
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                    {completedGoals.length} completed
                  </p>
                </div>
              </div>
              {activeGoals.slice(0, 3).map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{goal.title}</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(goal.currentAmount)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        of {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active goals</p>
              <p className="text-sm">Create your first financial goal to get started</p>
            </div>
          )}
        </div>

        {/* Budget Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Budget Status</span>
          </h3>
          {budgetsWithSpending.length > 0 ? (
            <div className="space-y-4">
              {budgetsWithSpending.slice(0, 4).map(budget => (
                <div key={budget.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{budget.category}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          budget.utilization > 100 
                            ? 'bg-red-500' 
                            : budget.utilization > budget.alertThreshold 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budget.utilization, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(budget.spentAmount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      of {formatCurrency(budget.budgetAmount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active budgets</p>
              <p className="text-sm">Create budgets to track your spending</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={currentMonthTransactions.slice(0, 10)} />
    </div>
  );
};