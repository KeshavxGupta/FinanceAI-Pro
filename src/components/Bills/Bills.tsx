import React, { useState } from 'react';
import { Bill } from '../../types';
import { BillCard } from './BillCard';
import { BillForm } from './BillForm';
import { Plus, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useBills } from '../../hooks/useBills';
import { differenceInDays } from 'date-fns';

export const Bills: React.FC = () => {
  const { 
    bills, 
    loading, 
    addBill, 
    updateBill, 
    deleteBill, 
    markBillAsPaid, 
    markBillAsUnpaid,
    getUpcomingBills,
    getOverdueBills,
    getPaidBills 
  } = useBills();
  const [showForm, setShowForm] = useState(false);

  const upcomingBills = getUpcomingBills();
  const overdueBills = getOverdueBills();
  const paidBills = getPaidBills();

  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalOverdue = overdueBills.reduce((sum, bill) => sum + bill.amount, 0);

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markBillAsPaid(id);
    } catch (error) {
      console.error('Failed to mark bill as paid:', error);
    }
  };

  const handleMarkAsUnpaid = async (id: string) => {
    try {
      await markBillAsUnpaid(id);
    } catch (error) {
      console.error('Failed to mark bill as unpaid:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Bill Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Keep track of your upcoming bills and payment schedules
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium">Add Bill</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500 rounded-xl shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Overdue</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                ${totalOverdue.toLocaleString()}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                {overdueBills.length} bills
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Upcoming</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                ${totalUpcoming.toLocaleString()}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {upcomingBills.length} bills
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Paid</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {paidBills.length}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Bills</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {bills.length}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bills Sections */}
      <div className="space-y-8">
        {/* Overdue Bills */}
        {overdueBills.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Overdue Bills ({overdueBills.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overdueBills.map((bill) => (
                <BillCard 
                  key={bill.id} 
                  bill={bill} 
                  onUpdate={updateBill}
                  onDelete={deleteBill}
                  onMarkAsPaid={handleMarkAsPaid}
                  onMarkAsUnpaid={handleMarkAsUnpaid}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Bills */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span>Upcoming Bills ({upcomingBills.length})</span>
          </h3>
          {upcomingBills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBills.map((bill) => (
                <BillCard 
                  key={bill.id} 
                  bill={bill} 
                  onUpdate={updateBill}
                  onDelete={deleteBill}
                  onMarkAsPaid={handleMarkAsPaid}
                  onMarkAsUnpaid={handleMarkAsUnpaid}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400">No upcoming bills</p>
            </div>
          )}
        </div>

        {/* Paid Bills */}
        {paidBills.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Paid Bills ({paidBills.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidBills.map((bill) => (
                <BillCard 
                  key={bill.id} 
                  bill={bill} 
                  onUpdate={updateBill}
                  onDelete={deleteBill}
                  onMarkAsPaid={handleMarkAsPaid}
                  onMarkAsUnpaid={handleMarkAsUnpaid}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bills.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No bills yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add your first bill to start tracking payments
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Bill</span>
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <BillForm
          onAddBill={addBill}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};