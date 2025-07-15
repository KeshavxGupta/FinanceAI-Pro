import React, { useState } from 'react';
import { BudgetCard } from './BudgetCard';
import { BudgetForm } from './BudgetForm';
import { Plus, Target, TrendingUp, AlertTriangle, Filter, Calendar, DollarSign, PieChart } from 'lucide-react';
import { useBudgets } from '../../hooks/useBudgets';
import { useTransactions } from '../../hooks/useTransactions';

export const Budgets: React.FC = () => {
  const { budgets, loading, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { transactions } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Calculate actual spending for each budget
  const budgetsWithSpending = budgets.map(budget => {
    const budgetTransactions = transactions.filter(t => 
      t.type === 'expense' && 
      t.category === budget.category &&
      t.date >= budget.startDate &&
      t.date <= budget.endDate
    );
    const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...budget,
      spentAmount: spent,
      utilization: budget.budgetAmount > 0 ? (spent / budget.budgetAmount) * 100 : 0,
      remainingAmount: budget.budgetAmount - spent,
      transactionCount: budgetTransactions.length
    };
  });

  // Filter budgets
  const filteredBudgets = budgetsWithSpending.filter(budget => {
    const periodMatch = filterPeriod === 'all' || budget.period === filterPeriod;
    let statusMatch = true;
    
    if (filterStatus === 'over') statusMatch = budget.utilization > 100;
    else if (filterStatus === 'warning') statusMatch = budget.utilization > budget.alertThreshold && budget.utilization <= 100;
    else if (filterStatus === 'good') statusMatch = budget.utilization <= budget.alertThreshold;
    
    return periodMatch && statusMatch;
  });

  const totalBudget = budgetsWithSpending.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgetsWithSpending.reduce((sum, b) => sum + b.spentAmount, 0);
  const overBudgetCount = budgetsWithSpending.filter(b => b.utilization > 100).length;
  const warningCount = budgetsWithSpending.filter(b => b.utilization > b.alertThreshold && b.utilization <= 100).length;
  const remainingBudget = totalBudget - totalSpent;
  const overallUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Budget Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set spending limits and track your financial goals with intelligent insights
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {budgets.length} active budgets
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className={`text-sm font-medium ${
              overallUtilization > 100 ? 'text-red-600' : overallUtilization > 80 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {overallUtilization.toFixed(1)}% overall utilization
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowForm(true)}
            className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Create Budget</span>
          </button>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Budget</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                ${totalBudget.toLocaleString()}
              </p>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(overallUtilization, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Spent</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {overallUtilization.toFixed(1)}% of budget used
              </p>
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 ${
          remainingBudget >= 0 
            ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'
            : 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl shadow-lg ${
              remainingBudget >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                remainingBudget >= 0 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
              </p>
              <p className={`text-2xl font-bold ${
                remainingBudget >= 0 
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
              }`}>
                ${Math.abs(remainingBudget).toLocaleString()}
              </p>
              <p className={`text-xs mt-1 ${
                remainingBudget >= 0 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {remainingBudget >= 0 ? 'Available to spend' : 'Exceeding limits'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl shadow-lg ${
              overBudgetCount > 0 ? 'bg-red-500' : 'bg-orange-500'
            }`}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Alerts</p>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {overBudgetCount}
                </span>
                <span className="text-sm text-gray-500">over</span>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {warningCount}
                </span>
                <span className="text-sm text-gray-500">warning</span>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Budget status alerts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Filter Budgets</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Periods</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="good">On Track</option>
              <option value="warning">Warning</option>
              <option value="over">Over Budget</option>
            </select>
          </div>
        </div>
        
        {filteredBudgets.length !== budgets.length && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Showing {filteredBudgets.length} of {budgets.length} budgets
            </p>
          </div>
        )}
      </div>

      {/* Budget Cards */}
      {filteredBudgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => (
            <BudgetCard 
              key={budget.id} 
              budget={budget} 
              onUpdate={updateBudget}
              onDelete={deleteBudget}
            />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Target className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No budgets yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first budget to start tracking your spending and achieve your financial goals
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Budget</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Filter className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-500 dark:text-gray-400">No budgets match your current filters</p>
          <button
            onClick={() => {
              setFilterPeriod('all');
              setFilterStatus('all');
            }}
            className="mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Budget Insights */}
      {budgets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            <span>Budget Insights</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Most Utilized Category
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                {budgetsWithSpending.length > 0 
                  ? budgetsWithSpending.sort((a, b) => b.utilization - a.utilization)[0].category
                  : 'No data'
                } - {budgetsWithSpending.length > 0 
                  ? budgetsWithSpending.sort((a, b) => b.utilization - a.utilization)[0].utilization.toFixed(1)
                  : '0'
                }%
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-900 dark:text-green-300">
                Best Performing Budget
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                {budgetsWithSpending.filter(b => b.utilization <= b.alertThreshold).length > 0
                  ? budgetsWithSpending.filter(b => b.utilization <= b.alertThreshold)[0].category
                  : 'None on track'
                }
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                Average Utilization
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                {budgetsWithSpending.length > 0 
                  ? (budgetsWithSpending.reduce((sum, b) => sum + b.utilization, 0) / budgetsWithSpending.length).toFixed(1)
                  : '0'
                }% across all budgets
              </p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <BudgetForm
          onAddBudget={addBudget}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};