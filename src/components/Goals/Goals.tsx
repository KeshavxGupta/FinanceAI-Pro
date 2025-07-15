import React, { useState } from 'react';
import { GoalCard } from './GoalCard';
import { GoalForm } from './GoalForm';
import { Plus, Target, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';

export const Goals: React.FC = () => {
  const { goals, loading, addGoal, updateGoal, deleteGoal, updateGoalProgress } = useGoals();
  const [showForm, setShowForm] = useState(false);

  const activeGoals = goals.filter(g => g.isActive);
  const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
  const completedGoals = activeGoals.filter(g => g.currentAmount >= g.targetAmount).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Financial Goals
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress towards financial milestones
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium">Add Goal</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Goals</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {activeGoals.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Saved</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                ${totalCurrentAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Progress</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {overallProgress.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Completed</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {completedGoals} / {activeGoals.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onUpdate={updateGoal}
              onDelete={deleteGoal}
              onUpdateProgress={updateGoalProgress}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Target className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No goals yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first financial goal to start tracking your progress
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Goal</span>
          </button>
        </div>
      )}

      {showForm && (
        <GoalForm
          onAddGoal={addGoal}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};