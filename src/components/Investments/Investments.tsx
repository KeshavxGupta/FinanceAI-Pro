import React, { useState } from 'react';
import { Investment } from '../../types';
import { InvestmentCard } from './InvestmentCard';
import { InvestmentForm } from './InvestmentForm';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, Filter, BarChart3, Target, Zap } from 'lucide-react';
import { useInvestments } from '../../hooks/useInvestments';

export const Investments: React.FC = () => {
  const { investments, loading, addInvestment, updateInvestment, deleteInvestment } = useInvestments();
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [sortBy, setSortBy] = useState('performance');

  const totalValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0);
  const totalCost = investments.reduce((sum, inv) => sum + (inv.shares * inv.purchasePrice), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  const gainers = investments.filter(inv => inv.currentPrice > inv.purchasePrice);
  const losers = investments.filter(inv => inv.currentPrice < inv.purchasePrice);
  const unchanged = investments.filter(inv => inv.currentPrice === inv.purchasePrice);

  // Enhanced investment data with calculations
  const enhancedInvestments = investments.map(inv => {
    const currentValue = inv.shares * inv.currentPrice;
    const purchaseValue = inv.shares * inv.purchasePrice;
    const gainLoss = currentValue - purchaseValue;
    const gainLossPercent = purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;
    const portfolioWeight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
    
    return {
      ...inv,
      currentValue,
      purchaseValue,
      gainLoss,
      gainLossPercent,
      portfolioWeight
    };
  });

  // Filter investments
  const filteredInvestments = enhancedInvestments.filter(inv => {
    const typeMatch = filterType === 'all' || inv.type === filterType;
    const sectorMatch = filterSector === 'all' || inv.sector === filterSector;
    return typeMatch && sectorMatch;
  });

  // Sort investments
  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    switch (sortBy) {
      case 'performance':
        return b.gainLossPercent - a.gainLossPercent;
      case 'value':
        return b.currentValue - a.currentValue;
      case 'weight':
        return b.portfolioWeight - a.portfolioWeight;
      case 'alphabetical':
        return a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });

  // Get unique sectors and types
  const sectors = [...new Set(investments.map(inv => inv.sector).filter(Boolean))];
  const types = [...new Set(investments.map(inv => inv.type))];

  // Portfolio allocation by type
  const typeAllocation = types.map(type => {
    const typeInvestments = enhancedInvestments.filter(inv => inv.type === type);
    const typeValue = typeInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    return {
      type,
      value: typeValue,
      percentage: totalValue > 0 ? (typeValue / totalValue) * 100 : 0,
      count: typeInvestments.length
    };
  }).filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Investment Portfolio
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your investment performance and portfolio allocation with advanced analytics
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {investments.length} holdings
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className={`text-sm font-medium ${
              totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}% total return
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowForm(true)}
            className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Add Investment</span>
          </button>
        </div>
      </div>

      {/* Enhanced Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Portfolio Value</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                ${totalValue.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Cost basis: ${totalCost.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${
          totalGainLoss >= 0 
            ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'
            : 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
        } rounded-2xl p-6 border hover:shadow-lg transition-all duration-300`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl shadow-lg ${
              totalGainLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {totalGainLoss >= 0 ? (
                <TrendingUp className="w-6 h-6 text-white" />
              ) : (
                <TrendingDown className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                totalGainLoss >= 0 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                Total Gain/Loss
              </p>
              <p className={`text-2xl font-bold ${
                totalGainLoss >= 0 
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
              </p>
              <p className={`text-xs mt-1 ${
                totalGainLoss >= 0 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}% return
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Performance</p>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {gainers.length}
                </span>
                <span className="text-xs text-gray-500">up</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {losers.length}
                </span>
                <span className="text-xs text-gray-500">down</span>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {unchanged.length} unchanged
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Diversification</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {types.length}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                asset types, {sectors.length} sectors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Filter & Sort Portfolio</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="performance">Sort by Performance</option>
              <option value="value">Sort by Value</option>
              <option value="weight">Sort by Weight</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>
          </div>
        </div>
        
        {sortedInvestments.length !== investments.length && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Showing {sortedInvestments.length} of {investments.length} investments
            </p>
          </div>
        )}
      </div>

      {/* Portfolio Allocation */}
      {typeAllocation.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            <span>Portfolio Allocation</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {typeAllocation.map((allocation, index) => (
              <div key={allocation.type} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {allocation.type.charAt(0).toUpperCase() + allocation.type.slice(1).replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {allocation.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${allocation.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>${allocation.value.toLocaleString()}</span>
                  <span>{allocation.count} holdings</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Summary */}
      {investments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Top Performers ({gainers.length})</span>
            </h3>
            <div className="space-y-3">
              {enhancedInvestments
                .filter(inv => inv.gainLossPercent > 0)
                .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
                .slice(0, 3)
                .map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{investment.symbol}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{investment.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {investment.portfolioWeight.toFixed(1)}% of portfolio
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        +{investment.gainLossPercent.toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${investment.currentPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        +${investment.gainLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              {gainers.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No profitable investments yet</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span>Underperformers ({losers.length})</span>
            </h3>
            <div className="space-y-3">
              {enhancedInvestments
                .filter(inv => inv.gainLossPercent < 0)
                .sort((a, b) => a.gainLossPercent - b.gainLossPercent)
                .slice(0, 3)
                .map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{investment.symbol}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{investment.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {investment.portfolioWeight.toFixed(1)}% of portfolio
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        {investment.gainLossPercent.toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${investment.currentPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        ${investment.gainLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              {losers.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No underperforming investments</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Investment Holdings */}
      {sortedInvestments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedInvestments.map((investment) => (
            <InvestmentCard 
              key={investment.id} 
              investment={investment} 
              onUpdate={updateInvestment}
              onDelete={deleteInvestment}
            />
          ))}
        </div>
      ) : investments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <TrendingUp className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No investments yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start building your investment portfolio to track performance and grow your wealth
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Investment</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Filter className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-500 dark:text-gray-400">No investments match your current filters</p>
          <button
            onClick={() => {
              setFilterType('all');
              setFilterSector('all');
            }}
            className="mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Investment Insights */}
      {investments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Portfolio Insights</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Largest Holding
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                {enhancedInvestments.length > 0 
                  ? `${enhancedInvestments.sort((a, b) => b.currentValue - a.currentValue)[0].symbol} - ${enhancedInvestments.sort((a, b) => b.currentValue - a.currentValue)[0].portfolioWeight.toFixed(1)}%`
                  : 'No data'
                }
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-900 dark:text-green-300">
                Best Performer
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                {gainers.length > 0 
                  ? `${enhancedInvestments.filter(inv => inv.gainLossPercent > 0).sort((a, b) => b.gainLossPercent - a.gainLossPercent)[0].symbol} +${enhancedInvestments.filter(inv => inv.gainLossPercent > 0).sort((a, b) => b.gainLossPercent - a.gainLossPercent)[0].gainLossPercent.toFixed(1)}%`
                  : 'No gains yet'
                }
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                Portfolio Diversity
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                {types.length} asset types across {sectors.length} sectors
              </p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <InvestmentForm
          onAddInvestment={addInvestment}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};