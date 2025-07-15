import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'CNY' | 'CHF' | 'HKD' | 'SGD' | 'MXN' | 'BRL' | 'ZAR' | 'RUB' | 'KRW' | 'NZD';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimalPlaces: number;
}

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  formatCurrency: (amount: number) => string;
}

const currencyData: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimalPlaces: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimalPlaces: 2 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimalPlaces: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimalPlaces: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimalPlaces: 0 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimalPlaces: 2 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimalPlaces: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimalPlaces: 2 },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', decimalPlaces: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimalPlaces: 2 },
  MXN: { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', decimalPlaces: 2 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimalPlaces: 2 },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimalPlaces: 2 },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', decimalPlaces: 2 },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', decimalPlaces: 0 },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', decimalPlaces: 2 }
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(currencyData.USD);

  useEffect(() => {
    // Load saved currency preference from localStorage
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency && currencyData[savedCurrency as CurrencyCode]) {
      setCurrencyState(currencyData[savedCurrency as CurrencyCode]);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(currencyData[code]);
    localStorage.setItem('currency', code);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};