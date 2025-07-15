import { useCurrency } from '../contexts/CurrencyContext';

// Format currency values using the global currency context
export const useCurrencyFormatter = () => {
  const { formatCurrency } = useCurrency();
  
  return {
    formatCurrency,
    
    // Format large numbers for display
    formatCompactCurrency: (amount: number): string => {
      const { currency } = useCurrency();
      
      if (amount >= 1000000) {
        return `${currency.symbol}${(amount / 1000000).toFixed(2)}M`;
      } else if (amount >= 1000) {
        return `${currency.symbol}${(amount / 1000).toFixed(1)}K`;
      } else {
        return formatCurrency(amount);
      }
    }
  };
};

// Format date values
export const formatDate = (date: string | Date, format: string = 'MM/dd/yyyy'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Simple formatter - can be expanded for more complex formats
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${month}/${day}/${year}`;
  }
};

// Format percentage values
export const formatPercentage = (value: number, decimalPlaces: number = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

// Format number with commas
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};