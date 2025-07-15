import React, { useState } from 'react';
import { Transaction } from '../../types';
import { categorizeTransaction } from '../../services/aiService';
import { X, Save } from 'lucide-react';

interface TransactionEditFormProps {
  transaction: Transaction;
  onUpdateTransaction: (transactionData: Partial<Transaction>) => Promise<void>;
  onClose: () => void;
}

const categories = [
  // Essential Categories
  'Groceries', 'Rent', 'Mortgage', 'Transportation', 'Utilities', 'Insurance', 'Healthcare',
  // Lifestyle Categories
  'Dining Out', 'Entertainment', 'Shopping', 'Travel', 'Subscriptions', 'Personal Care',
  // Financial Categories
  'Salary', 'Investments', 'Savings', 'Debt Payment', 'Taxes', 'Retirement',
  // Home Categories
  'Home Maintenance', 'Home Improvement', 'Furniture', 'Appliances', 'Household Supplies',
  // Family Categories
  'Childcare', 'Education', 'Pet Expenses', 'Gifts', 'Charity', 'Family Support',
  // Miscellaneous
  'Hobbies', 'Fitness', 'Electronics', 'Clothing', 'Professional Services', 'Other',
  // Income Categories
  'Bonus', 'Commission', 'Freelance', 'Business', 'Dividends', 'Interest', 'Rental', 'Refund', 'Gift', 'Tax Return', 'Other Income'
];

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Debit/Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'digital_wallet', label: 'Digital Wallet' },
  { value: 'check', label: 'Check' },
  { value: 'automatic_payment', label: 'Automatic Payment' },
  { value: 'mobile_payment', label: 'Mobile Payment' },
  { value: 'crypto', label: 'Cryptocurrency' }
];

export const TransactionEditForm: React.FC<TransactionEditFormProps> = ({ 
  transaction, 
  onUpdateTransaction, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    amount: transaction.amount.toString(),
    category: transaction.category,
    description: transaction.description,
    date: transaction.date,
    type: transaction.type,
    merchant: transaction.merchant || '',
    location: transaction.location || '',
    paymentMethod: transaction.paymentMethod || 'card',
    notes: transaction.notes || '',
    tags: transaction.tags || []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  const handleDescriptionChange = (description: string) => {
    setFormData(prev => ({
      ...prev,
      description,
      category: prev.category || categorizeTransaction(description)
    }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
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
      await onUpdateTransaction({
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
        type: formData.type as 'income' | 'expense',
        merchant: formData.merchant.trim() || undefined,
        location: formData.location.trim() || undefined,
        paymentMethod: formData.paymentMethod as any,
        notes: formData.notes.trim() || undefined,
        tags: formData.tags.filter(tag => tag.trim())
      });
      onClose();
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Transaction
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Update transaction details
            </p>
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
                Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'expense' }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Expense</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Income</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, amount: e.target.value }));
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                  }}
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                    errors.amount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  required
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
              {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                  if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              >
                <option value="">Select Category</option>
                {formData.type === 'expense' ? (
                  <>
                    <optgroup label="Essential">
                      <option value="Groceries">Groceries</option>
                      <option value="Rent">Rent</option>
                      <option value="Mortgage">Mortgage</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Healthcare">Healthcare</option>
                    </optgroup>
                    <optgroup label="Lifestyle">
                      <option value="Dining Out">Dining Out</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Travel">Travel</option>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Personal Care">Personal Care</option>
                    </optgroup>
                    <optgroup label="Financial">
                      <option value="Debt Payment">Debt Payment</option>
                      <option value="Taxes">Taxes</option>
                      <option value="Retirement">Retirement</option>
                    </optgroup>
                    <optgroup label="Home">
                      <option value="Home Maintenance">Home Maintenance</option>
                      <option value="Home Improvement">Home Improvement</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Appliances">Appliances</option>
                      <option value="Household Supplies">Household Supplies</option>
                    </optgroup>
                    <optgroup label="Family">
                      <option value="Childcare">Childcare</option>
                      <option value="Education">Education</option>
                      <option value="Pet Expenses">Pet Expenses</option>
                      <option value="Gifts">Gifts</option>
                      <option value="Charity">Charity</option>
                      <option value="Family Support">Family Support</option>
                    </optgroup>
                    <optgroup label="Miscellaneous">
                      <option value="Hobbies">Hobbies</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Other">Other</option>
                    </optgroup>
                  </>
                ) : (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Commission">Commission</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Business">Business</option>
                    <option value="Investments">Investments</option>
                    <option value="Dividends">Dividends</option>
                    <option value="Interest">Interest</option>
                    <option value="Rental">Rental Income</option>
                    <option value="Refund">Refund</option>
                    <option value="Gift">Gift</option>
                    <option value="Tax Return">Tax Return</option>
                    <option value="Other Income">Other Income</option>
                  </>
                )}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, date: e.target.value }));
                  if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
              {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Merchant (Optional)
              </label>
              <input
                type="text"
                value={formData.merchant}
                onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="e.g., Starbucks, Amazon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="e.g., Downtown Mall, Main Street"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)} 
                      className="ml-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="Add tags (press Enter or comma to add)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-blue-500 text-white rounded-r-xl hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Separate tags with Enter or comma
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Additional notes about this transaction..."
              />
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};