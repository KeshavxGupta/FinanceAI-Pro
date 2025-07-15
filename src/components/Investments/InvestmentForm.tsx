import React, { useState } from 'react';
import { Investment } from '../../types';
import { X, Plus, TrendingUp } from 'lucide-react';

interface InvestmentFormProps {
  onAddInvestment: (investment: Omit<Investment, 'id'>) => Promise<void>;
  onClose: () => void;
}

const investmentTypes = [
  { value: 'stock', label: 'Stock', icon: '📈' },
  { value: 'bond', label: 'Bond', icon: '🏛️' },
  { value: 'etf', label: 'ETF', icon: '📊' },
  { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
  { value: 'mutual_fund', label: 'Mutual Fund', icon: '🏦' }
];

const sectors = [
  'Technology', 'Healthcare', 'Financial', 'Consumer Goods', 'Energy',
  'Real Estate', 'Utilities', 'Materials', 'Industrials', 'Telecommunications',
  'Diversified', 'Other'
];

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ onAddInvestment, onClose }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    shares: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    type: 'stock' as Investment['type'],
    sector: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    } else if (formData.symbol.trim().length < 1) {
      newErrors.symbol = 'Symbol must be at least 1 character';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Investment name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.shares || parseFloat(formData.shares) <= 0) {
      newErrors.shares = 'Shares must be greater than 0';
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }

    if (!formData.currentPrice || parseFloat(formData.currentPrice) <= 0) {
      newErrors.currentPrice = 'Current price must be greater than 0';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    } else if (new Date(formData.purchaseDate) > new Date()) {
      newErrors.purchaseDate = 'Purchase date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onAddInvestment({
        symbol: formData.symbol.trim().toUpperCase(),
        name: formData.name.trim(),
        shares: parseFloat(formData.shares),
        purchasePrice: parseFloat(formData.purchasePrice),
        currentPrice: parseFloat(formData.currentPrice),
        purchaseDate: formData.purchaseDate,
        type: formData.type,
        sector: formData.sector || undefined
      });
      onClose();
    } catch (error) {
      console.error('Failed to create investment:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add Investment
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track a new investment in your portfolio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Symbol *
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }));
                  clearError('symbol');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.symbol ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., AAPL, BTC"
                maxLength={10}
              />
              {errors.symbol && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.symbol}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Investment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Investment['type'] }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                {investmentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Investment Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  clearError('name');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Apple Inc., Bitcoin"
                maxLength={100}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shares/Units *
              </label>
              <input
                type="number"
                step="0.00000001"
                value={formData.shares}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, shares: e.target.value }));
                  clearError('shares');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.shares ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="10"
                min="0.00000001"
              />
              {errors.shares && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shares}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purchase Date *
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, purchaseDate: e.target.value }));
                  clearError('purchaseDate');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.purchaseDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.purchaseDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.purchaseDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purchase Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, purchasePrice: e.target.value }));
                    clearError('purchasePrice');
                  }}
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                    errors.purchasePrice ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="150.00"
                  min="0.01"
                />
              </div>
              {errors.purchasePrice && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.purchasePrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentPrice}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, currentPrice: e.target.value }));
                    clearError('currentPrice');
                  }}
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                    errors.currentPrice ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="175.50"
                  min="0.01"
                />
              </div>
              {errors.currentPrice && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPrice}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sector (Optional)
              </label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="">Select Sector</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Investment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};