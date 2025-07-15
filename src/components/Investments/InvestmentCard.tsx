import React, { useState } from 'react';
import { Investment } from '../../types';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Edit, Trash2, BarChart3, Target, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { InvestmentEditForm } from './InvestmentEditForm';
import { InvestmentDeleteModal } from './InvestmentDeleteModal';

interface InvestmentCardProps {
  investment: Investment & {
    currentValue: number;
    purchaseValue: number;
    gainLoss: number;
    gainLossPercent: number;
    portfolioWeight: number;
  };
  onUpdate: (id: string, data: Partial<Investment>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const isGain = investment.gainLoss >= 0;
  const isSignificantGain = investment.gainLossPercent >= 10;
  const isSignificantLoss = investment.gainLossPercent <= -10;

  const getTypeIcon = () => {
    switch (investment.type) {
      case 'stock': return '📈';
      case 'bond': return '🏛️';
      case 'etf': return '📊';
      case 'crypto': return '₿';
      case 'mutual_fund': return '🏦';
      default: return '💼';
    }
  };

  const getTypeColor = () => {
    switch (investment.type) {
      case 'stock': return 'from-blue-500 to-cyan-500';
      case 'bond': return 'from-green-500 to-emerald-500';
      case 'etf': return 'from-purple-500 to-pink-500';
      case 'crypto': return 'from-orange-500 to-yellow-500';
      case 'mutual_fund': return 'from-indigo-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPerformanceColor = () => {
    if (isSignificantGain) return 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 border-green-200 dark:border-green-800';
    if (isSignificantLoss) return 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800';
    if (isGain) return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800';
    return 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800';
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleUpdateInvestment = async (data: Partial<Investment>) => {
    await onUpdate(investment.id, data);
    setShowEditForm(false);
  };

  const handleDeleteInvestment = async () => {
    await onDelete(investment.id);
    setShowDeleteModal(false);
  };

  const daysSincePurchase = Math.floor((new Date().getTime() - new Date(investment.purchaseDate).getTime()) / (1000 * 60 * 60 * 24));
  const annualizedReturn = daysSincePurchase > 0 ? (investment.gainLossPercent * 365) / daysSincePurchase : 0;

  return (
    <>
      <div className={`bg-gradient-to-br ${getPerformanceColor()} rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-24 h-24 transform rotate-12 translate-x-4 -translate-y-4">
            <div className="text-4xl">{getTypeIcon()}</div>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 bg-gradient-to-r ${getTypeColor()} rounded-xl shadow-lg`}>
              <span className="text-xl">{getTypeIcon()}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {investment.symbol}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {investment.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {investment.sector && (
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded-full">
                    {investment.sector}
                  </span>
                )}
                <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-xs text-blue-600 dark:text-blue-400 rounded-full">
                  {investment.type.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-bold ${
              isGain 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {isGain ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isGain ? '+' : ''}{investment.gainLossPercent.toFixed(2)}%</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                onClick={handleEdit}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Edit investment"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Delete investment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Holdings and Price Info */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center space-x-1">
              <BarChart3 className="w-3 h-3" />
              <span>Shares</span>
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {investment.shares.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {investment.portfolioWeight.toFixed(1)}% of portfolio
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span>Current Price</span>
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${investment.currentPrice.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              vs ${investment.purchasePrice.toLocaleString()} cost
            </p>
          </div>
        </div>

        {/* Value Information */}
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current Value</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ${investment.currentValue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Purchase Value</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ${investment.purchaseValue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Gain/Loss</span>
            <div className="text-right">
              <p className={`text-xl font-bold ${
                isGain 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {isGain ? '+' : ''}${investment.gainLoss.toLocaleString()}
              </p>
              <p className={`text-sm ${
                isGain 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {isGain ? '+' : ''}{investment.gainLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Days held:</span>
              <span className="font-medium text-gray-900 dark:text-white">{daysSincePurchase}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Annualized return:</span>
              <span className={`font-medium ${
                annualizedReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {annualizedReturn >= 0 ? '+' : ''}{annualizedReturn.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Portfolio weight:</span>
              <span className="font-medium text-gray-900 dark:text-white">{investment.portfolioWeight.toFixed(1)}%</span>
            </div>
          </div>

          {/* Purchase Date */}
          <div className="flex items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Purchased {format(new Date(investment.purchaseDate), 'MMM dd, yyyy')}
            </span>
          </div>

          {/* Performance Badges */}
          <div className="flex flex-wrap gap-2">
            {isSignificantGain && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                <Zap className="w-3 h-3" />
                <span>Strong Performer</span>
              </span>
            )}
            {isSignificantLoss && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs font-medium">
                <TrendingDown className="w-3 h-3" />
                <span>Underperforming</span>
              </span>
            )}
            {investment.portfolioWeight > 10 && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium">
                <Target className="w-3 h-3" />
                <span>Large Position</span>
              </span>
            )}
            {daysSincePurchase > 365 && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full text-xs font-medium">
                <Calendar className="w-3 h-3" />
                <span>Long Term</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditForm && (
        <InvestmentEditForm
          investment={investment}
          onUpdateInvestment={handleUpdateInvestment}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <InvestmentDeleteModal
          investment={investment}
          onDeleteInvestment={handleDeleteInvestment}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};