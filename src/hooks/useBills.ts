import { useState, useCallback } from 'react';
import { Bill } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { mockBills } from '../services/mockData';
import toast from 'react-hot-toast';

export function useBills() {
  const [bills, setBills] = useLocalStorage<Bill[]>('bills', mockBills);
  const [loading, setLoading] = useState(false);

  const addBill = useCallback(async (billData: Omit<Bill, 'id'>) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!billData.name?.trim()) {
        throw new Error('Bill name is required');
      }
      if (!billData.amount || billData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!billData.dueDate) {
        throw new Error('Due date is required');
      }
      if (!billData.category?.trim()) {
        throw new Error('Category is required');
      }

      // Check for duplicate bill names
      const existingBill = bills.find(bill => 
        bill.name.toLowerCase().trim() === billData.name.toLowerCase().trim()
      );
      if (existingBill) {
        throw new Error('A bill with this name already exists');
      }

      const newBill: Bill = {
        ...billData,
        id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: billData.name.trim(),
        category: billData.category.trim(),
        notes: billData.notes?.trim() || undefined,
      };
      
      setBills(prev => [newBill, ...prev]);
      toast.success('Bill added successfully');
      return newBill;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add bill');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBills, bills]);

  const updateBill = useCallback(async (id: string, billData: Partial<Bill>) => {
    setLoading(true);
    try {
      const existingBill = bills.find(b => b.id === id);
      if (!existingBill) {
        throw new Error('Bill not found');
      }

      // Validate updated data
      if (billData.name !== undefined && !billData.name.trim()) {
        throw new Error('Bill name cannot be empty');
      }
      if (billData.amount !== undefined && billData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (billData.category !== undefined && !billData.category.trim()) {
        throw new Error('Category cannot be empty');
      }

      // Check for duplicate names (excluding current bill)
      if (billData.name) {
        const duplicateBill = bills.find(bill => 
          bill.id !== id &&
          bill.name.toLowerCase().trim() === billData.name!.toLowerCase().trim()
        );
        if (duplicateBill) {
          throw new Error('A bill with this name already exists');
        }
      }

      setBills(prev => 
        prev.map(bill => 
          bill.id === id 
            ? { 
                ...bill, 
                ...billData,
                name: billData.name?.trim() || bill.name,
                category: billData.category?.trim() || bill.category,
                notes: billData.notes?.trim() || bill.notes,
              }
            : bill
        )
      );
      toast.success('Bill updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update bill');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBills, bills]);

  const deleteBill = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const existingBill = bills.find(b => b.id === id);
      if (!existingBill) {
        throw new Error('Bill not found');
      }

      setBills(prev => prev.filter(bill => bill.id !== id));
      toast.success('Bill deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete bill');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBills, bills]);

  const markBillAsPaid = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const existingBill = bills.find(b => b.id === id);
      if (!existingBill) {
        throw new Error('Bill not found');
      }

      if (existingBill.isPaid) {
        throw new Error('Bill is already marked as paid');
      }

      setBills(prev => 
        prev.map(bill => 
          bill.id === id 
            ? { ...bill, isPaid: true }
            : bill
        )
      );
      toast.success('Bill marked as paid');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark bill as paid');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBills, bills]);

  const markBillAsUnpaid = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const existingBill = bills.find(b => b.id === id);
      if (!existingBill) {
        throw new Error('Bill not found');
      }

      setBills(prev => 
        prev.map(bill => 
          bill.id === id 
            ? { ...bill, isPaid: false }
            : bill
        )
      );
      toast.success('Bill marked as unpaid');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark bill as unpaid');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBills, bills]);

  const getUpcomingBills = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return bills.filter(bill => !bill.isPaid && bill.dueDate >= today);
  }, [bills]);

  const getOverdueBills = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return bills.filter(bill => !bill.isPaid && bill.dueDate < today);
  }, [bills]);

  const getPaidBills = useCallback(() => {
    return bills.filter(bill => bill.isPaid);
  }, [bills]);

  const getBillsByCategory = useCallback((category: string) => {
    return bills.filter(bill => bill.category.toLowerCase() === category.toLowerCase());
  }, [bills]);

  return {
    bills,
    loading,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    markBillAsUnpaid,
    getUpcomingBills,
    getOverdueBills,
    getPaidBills,
    getBillsByCategory,
  };
}