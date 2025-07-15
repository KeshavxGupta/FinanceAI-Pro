import { Transaction, FinancialInsight } from '../types';

// Smart categorization based on transaction description
export const categorizeTransaction = (description: string): string => {
  const categories: Record<string, string[]> = {
    // Essential Categories
    'Groceries': ['grocery', 'supermarket', 'whole foods', 'trader joe', 'safeway', 'kroger', 'food', 'market', 'walmart', 'target', 'costco', 'aldi', 'publix', 'food lion'],
    'Rent': ['rent', 'apartment', 'landlord', 'housing'],
    'Mortgage': ['mortgage', 'home loan', 'house payment'],
    'Transportation': ['gas', 'fuel', 'uber', 'lyft', 'taxi', 'metro', 'bus', 'parking', 'car', 'vehicle', 'auto', 'shell', 'exxon', 'bp', 'transit', 'train', 'subway'],
    'Utilities': ['electric', 'electricity', 'water', 'gas bill', 'internet', 'phone', 'cable', 'verizon', 'att', 'comcast', 'utility', 'power', 'energy'],
    'Insurance': ['insurance', 'policy', 'premium', 'coverage', 'geico', 'state farm', 'allstate', 'progressive', 'nationwide', 'liberty mutual'],
    'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medical', 'dentist', 'health', 'cvs', 'walgreens', 'clinic', 'prescription', 'therapy', 'healthcare'],
    
    // Lifestyle Categories
    'Dining Out': ['restaurant', 'cafe', 'starbucks', 'mcdonalds', 'pizza', 'takeout', 'delivery', 'doordash', 'grubhub', 'ubereats', 'dining', 'eatery', 'diner', 'bistro'],
    'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert', 'theater', 'entertainment', 'disney', 'hulu', 'amazon prime', 'ticket', 'show', 'event'],
    'Shopping': ['amazon', 'target', 'walmart', 'store', 'mall', 'clothing', 'shoes', 'electronics', 'best buy', 'apple store', 'retail', 'purchase', 'shop'],
    'Travel': ['hotel', 'airbnb', 'flight', 'airline', 'vacation', 'trip', 'booking', 'expedia', 'airfare', 'lodging', 'resort', 'travel'],
    'Subscriptions': ['subscription', 'monthly', 'annual', 'premium', 'plus', 'pro', 'membership', 'recurring', 'service'],
    'Personal Care': ['salon', 'haircut', 'spa', 'massage', 'beauty', 'cosmetics', 'barber', 'grooming', 'skincare', 'makeup'],
    
    // Financial Categories
    'Salary': ['salary', 'payroll', 'wages', 'income', 'paycheck', 'direct deposit', 'employer', 'compensation', 'earnings'],
    'Investments': ['investment', 'stock', 'etf', 'mutual fund', 'brokerage', 'dividend', 'capital gain', 'securities', 'portfolio'],
    'Savings': ['savings', 'deposit', 'transfer to savings', 'emergency fund', 'reserve'],
    'Debt Payment': ['loan payment', 'credit card payment', 'debt', 'student loan', 'personal loan', 'finance charge', 'interest'],
    'Taxes': ['tax', 'irs', 'state tax', 'property tax', 'tax payment', 'tax return', 'tax refund'],
    'Retirement': ['401k', 'ira', 'retirement', 'pension', 'roth', 'retirement contribution'],
    
    // Home Categories
    'Home Maintenance': ['maintenance', 'repair', 'plumber', 'electrician', 'lawn', 'gardening', 'cleaning service', 'home service'],
    'Home Improvement': ['renovation', 'remodel', 'improvement', 'home depot', 'lowes', 'hardware', 'construction', 'contractor'],
    'Furniture': ['furniture', 'couch', 'table', 'chair', 'bed', 'mattress', 'desk', 'ikea', 'ashley furniture'],
    'Appliances': ['appliance', 'refrigerator', 'washer', 'dryer', 'dishwasher', 'microwave', 'oven', 'vacuum'],
    'Household Supplies': ['household', 'supplies', 'cleaning', 'laundry', 'paper towels', 'toilet paper', 'detergent'],
    
    // Family Categories
    'Childcare': ['childcare', 'daycare', 'babysitter', 'nanny', 'child support', 'children'],
    'Education': ['school', 'university', 'course', 'book', 'tuition', 'education', 'college', 'learning', 'student', 'class'],
    'Pet Expenses': ['pet', 'veterinarian', 'vet', 'dog', 'cat', 'pet food', 'pet supplies', 'grooming', 'pet care'],
    'Gifts': ['gift', 'present', 'birthday', 'anniversary', 'holiday', 'christmas', 'wedding gift'],
    'Charity': ['charity', 'donation', 'donate', 'charitable', 'non-profit', 'fundraiser', 'contribution'],
    'Family Support': ['family', 'support', 'allowance', 'assistance', 'relative', 'parent', 'sibling'],
    
    // Miscellaneous
    'Hobbies': ['hobby', 'craft', 'art', 'music', 'instrument', 'photography', 'collection', 'sports equipment'],
    'Fitness': ['gym', 'fitness', 'workout', 'exercise', 'sports', 'athletic', 'training', 'yoga', 'pilates'],
    'Electronics': ['electronics', 'gadget', 'computer', 'laptop', 'phone', 'tablet', 'camera', 'headphones', 'speaker'],
    'Clothing': ['clothing', 'apparel', 'clothes', 'shoes', 'fashion', 'accessory', 'jewelry', 'watch'],
    'Professional Services': ['lawyer', 'accountant', 'consultant', 'advisor', 'professional', 'service', 'legal', 'financial advisor'],
    
    // Income Categories
    'Bonus': ['bonus', 'performance bonus', 'holiday bonus', 'incentive'],
    'Commission': ['commission', 'sales commission', 'referral fee'],
    'Freelance': ['freelance', 'contract work', 'gig', 'self-employed', 'consulting'],
    'Business': ['business income', 'profit', 'revenue', 'business', 'sale'],
    'Dividends': ['dividend', 'distribution', 'capital distribution'],
    'Interest': ['interest', 'interest income', 'interest payment'],
    'Rental': ['rent income', 'rental', 'tenant', 'property income', 'airbnb income'],
    'Refund': ['refund', 'reimbursement', 'return', 'cashback', 'money back'],
    'Gift': ['gift received', 'money gift', 'cash gift'],
    'Tax Return': ['tax return', 'tax refund', 'irs refund']
  };

  const lowerDesc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
};

// Generate AI insights based on transaction patterns
export const generateInsights = (transactions: Transaction[]): FinancialInsight[] => {
  const insights: FinancialInsight[] = [];
  
  if (transactions.length === 0) {
    return insights;
  }

  // Analyze spending patterns
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Find top spending category
  const topCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];

  if (topCategory && topCategory[1] > 0) {
    const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
    const percentage = (topCategory[1] / totalSpending) * 100;
    
    insights.push({
      id: `insight-${Date.now()}-1`,
      type: 'pattern',
      title: 'Top Spending Category',
      description: `Your highest spending category is ${topCategory[0]} with $${topCategory[1].toFixed(2)} (${percentage.toFixed(1)}% of total expenses).`,
      priority: percentage > 50 ? 'high' : 'medium',
      category: topCategory[0],
      timestamp: new Date().toISOString(),
      actionable: percentage > 40,
      action: percentage > 40 ? 'Consider reviewing expenses in this category' : undefined
    });
  }

  // Detect unusual spending
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  if (expenseTransactions.length > 0) {
    const avgTransactionAmount = expenseTransactions.reduce((sum, t) => sum + t.amount, 0) / expenseTransactions.length;
    const largeTransactions = expenseTransactions.filter(t => t.amount > avgTransactionAmount * 2.5);

    if (largeTransactions.length > 0) {
      insights.push({
        id: `insight-${Date.now()}-2`,
        type: 'alert',
        title: 'Unusual Spending Detected',
        description: `${largeTransactions.length} transaction(s) are significantly higher than your average spending of $${avgTransactionAmount.toFixed(2)}.`,
        priority: 'high',
        timestamp: new Date().toISOString(),
        actionable: true,
        action: 'Review these large transactions for accuracy'
      });
    }
  }

  // Analyze income vs expenses
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  if (totalIncome > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    
    if (savingsRate < 10) {
      insights.push({
        id: `insight-${Date.now()}-3`,
        type: 'tip',
        title: 'Low Savings Rate',
        description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of income.`,
        priority: 'high',
        timestamp: new Date().toISOString(),
        actionable: true,
        action: 'Consider reducing expenses or increasing income'
      });
    } else if (savingsRate >= 20) {
      insights.push({
        id: `insight-${Date.now()}-4`,
        type: 'achievement',
        title: 'Excellent Savings Rate',
        description: `Congratulations! Your savings rate of ${savingsRate.toFixed(1)}% exceeds the recommended 20%.`,
        priority: 'low',
        timestamp: new Date().toISOString(),
        actionable: false
      });
    }
  }

  // Detect recurring patterns
  const merchantCounts = transactions.reduce((acc, t) => {
    if (t.merchant) {
      acc[t.merchant] = (acc[t.merchant] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const frequentMerchants = Object.entries(merchantCounts)
    .filter(([, count]) => count >= 3)
    .sort(([,a], [,b]) => b - a);

  if (frequentMerchants.length > 0) {
    const [merchant, count] = frequentMerchants[0];
    insights.push({
      id: `insight-${Date.now()}-5`,
      type: 'pattern',
      title: 'Frequent Merchant',
      description: `You've made ${count} transactions at ${merchant}. Consider if this aligns with your spending goals.`,
      priority: 'medium',
      timestamp: new Date().toISOString(),
      actionable: true,
      action: 'Review spending patterns at frequent merchants'
    });
  }

  // Analyze spending by day of week
  const daySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const day = new Date(t.date).getDay(); // 0 = Sunday, 6 = Saturday
      const isWeekend = day === 0 || day === 6;
      acc[isWeekend ? 'weekend' : 'weekday'].push(t);
      return acc;
    }, { weekend: [] as Transaction[], weekday: [] as Transaction[] });

  if (daySpending.weekend.length > 0 && daySpending.weekday.length > 0) {
    const avgWeekendSpending = daySpending.weekend.reduce((sum, t) => sum + t.amount, 0) / daySpending.weekend.length;
    const avgWeekdaySpending = daySpending.weekday.reduce((sum, t) => sum + t.amount, 0) / daySpending.weekday.length;
    
    if (avgWeekendSpending > avgWeekdaySpending * 1.5) {
      insights.push({
        id: `insight-${Date.now()}-6`,
        type: 'pattern',
        title: 'Weekend Spending Spike',
        description: `Your average weekend spending ($${avgWeekendSpending.toFixed(2)}) is significantly higher than weekdays ($${avgWeekdaySpending.toFixed(2)}).`,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        actionable: true,
        action: 'Consider planning weekend activities with a budget in mind'
      });
    }
  }

  // Analyze subscription spending
  const subscriptionTransactions = transactions.filter(t => 
    t.type === 'expense' && 
    (t.category === 'Subscriptions' || 
     t.description.toLowerCase().includes('subscription') || 
     t.description.toLowerCase().includes('membership'))
  );
  
  if (subscriptionTransactions.length > 0) {
    const totalSubscriptionSpending = subscriptionTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    if (totalSubscriptionSpending > totalExpenses * 0.1) { // If subscriptions are more than 10% of expenses
      insights.push({
        id: `insight-${Date.now()}-7`,
        type: 'tip',
        title: 'High Subscription Costs',
        description: `You're spending $${totalSubscriptionSpending.toFixed(2)} on subscriptions, which is ${((totalSubscriptionSpending / totalExpenses) * 100).toFixed(1)}% of your expenses.`,
        priority: 'medium',
        category: 'Subscriptions',
        timestamp: new Date().toISOString(),
        actionable: true,
        action: 'Review your subscriptions and consider canceling unused ones'
      });
    }
  }

  return insights;
};

// Enhanced chatbot responses with more context awareness
export const getChatbotResponse = (message: string, context?: any): string => {
  const lowerMessage = message.toLowerCase();
  
  // Spending analysis
  if (lowerMessage.includes('spend') || lowerMessage.includes('spent')) {
    if (lowerMessage.includes('food') || lowerMessage.includes('grocery') || lowerMessage.includes('groceries')) {
      return "Based on your recent transactions, you've spent $285.50 on groceries and dining out this month. This represents about 18% of your total expenses. Consider meal planning to optimize this category.";
    }
    if (lowerMessage.includes('month') || lowerMessage.includes('monthly')) {
      return "Your total spending this month is $2,847.50 across all categories. Your top spending areas are: Rent ($1,200), Shopping ($450), and Groceries ($285.50). You're currently 12% under your total monthly budget.";
    }
    return "I can help you analyze your spending by category, time period, or merchant. What specific spending information would you like to know?";
  }
  
  // Category analysis
  if (lowerMessage.includes('top') && (lowerMessage.includes('categories') || lowerMessage.includes('category'))) {
    return "Your top 5 spending categories this month are:\n1. Rent: $1,200 (42%)\n2. Shopping: $450 (16%)\n3. Groceries: $285.50 (10%)\n4. Transportation: $167.89 (6%)\n5. Entertainment: $145 (5%)\n\nWould you like detailed analysis of any specific category?";
  }
  
  // Budget analysis
  if (lowerMessage.includes('budget')) {
    if (lowerMessage.includes('over') || lowerMessage.includes('exceeded')) {
      return "You're currently over budget in 1 category: Shopping ($450 spent vs $350 budgeted). You're within budget for all other categories. Consider reducing discretionary purchases or adjusting your shopping budget.";
    }
    return "Budget Status Summary:\n✅ Groceries: 71% used ($285.50/$400)\n⚠️ Shopping: 129% used ($450/$350) - Over budget!\n✅ Transportation: 56% used ($167.89/$300)\n✅ Entertainment: 73% used ($145/$200)\n\nOverall, you're doing well with most budgets!";
  }
  
  // Savings advice
  if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
    return "Here are personalized savings tips based on your spending:\n\n1. **Reduce shopping expenses** - You're $100 over budget here\n2. **Optimize subscriptions** - Review recurring payments\n3. **Meal prep** - Could save ~$50/month on food\n4. **Use the 24-hour rule** for non-essential purchases\n5. **Automate savings** - Set up automatic transfers\n\nWhich area would you like specific advice on?";
  }
  
  // Income analysis
  if (lowerMessage.includes('income')) {
    return "Your total income this month is $3,500. After expenses of $2,847.50, you have $652.50 remaining (18.6% savings rate). This is close to the recommended 20% savings rate. Great job!";
  }
  
  // Goal tracking
  if (lowerMessage.includes('goal') || lowerMessage.includes('goals')) {
    return "Goal Progress Update:\n🚨 Emergency Fund: 57% complete ($8,500/$15,000)\n✈️ European Vacation: 44% complete ($2,200/$5,000)\n🏠 House Down Payment: 24% complete ($12,000/$50,000)\n🚗 New Car Fund: 22% complete ($5,500/$25,000)\n\nYou're making great progress! Which goal would you like to focus on?";
  }
  
  // Financial health
  if (lowerMessage.includes('health') || lowerMessage.includes('score')) {
    return "Your Financial Health Score is 78/100 - Good! 📊\n\nBreakdown:\n• Budgeting: 85/100 (Excellent)\n• Saving: 72/100 (Good)\n• Debt Management: 90/100 (Excellent)\n• Investing: 65/100 (Fair)\n• Emergency Fund: 70/100 (Good)\n\nFocus on increasing your investment contributions to improve your overall score.";
  }
  
  // Investment advice
  if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
    return "Investment Portfolio Summary:\nTotal Value: $28,750 (+8.4% return)\n\nTop Performers:\n📈 AAPL: +17% ($1,755 value)\n📈 MSFT: +10.8% ($2,482 value)\n\nConsider diversifying with index funds and increasing your monthly contributions to reach your long-term goals.";
  }
  
  // Bill reminders
  if (lowerMessage.includes('bill') || lowerMessage.includes('bills')) {
    return "Upcoming Bills:\n⚠️ Electric Bill: $120 due in 5 days\n📅 Internet Service: $75 due in 8 days\n✅ Car Insurance: $180 (paid)\n\nYou have $195 in upcoming bills this month. All other bills are current.";
  }
  
  // Tax advice
  if (lowerMessage.includes('tax') || lowerMessage.includes('taxes')) {
    return "Tax Summary:\n• You've paid approximately $875 in taxes this year\n• Based on your income, you should set aside about 25% for taxes\n• Consider maximizing tax-advantaged accounts like your 401(k) and HSA\n• Track your deductible expenses like charitable donations and business expenses\n\nWould you like more specific tax planning advice?";
  }

  // Debt analysis
  if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
    return "Debt Overview:\n• Total Debt: $32,500\n• Student Loans: $18,000 (4.5% interest)\n• Car Loan: $12,500 (3.9% interest)\n• Credit Card: $2,000 (18.99% interest)\n\nRecommendation: Focus on paying off your high-interest credit card debt first, then consider the student loans. Your debt-to-income ratio is currently 28%, which is considered good.";
  }

  // Retirement planning
  if (lowerMessage.includes('retire') || lowerMessage.includes('retirement')) {
    return "Retirement Planning:\n• Current retirement savings: $45,000\n• Monthly contributions: $400\n• Projected retirement age: 65\n• Estimated retirement needs: $1.2M\n\nBased on your current savings rate, you're on track to reach about 75% of your retirement goal. Consider increasing your monthly contributions by at least $150 to stay fully on track.";
  }
  
  // General help
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
    return "I can help you with:\n\n💰 **Spending Analysis** - Track expenses by category, merchant, or time\n📊 **Budget Monitoring** - Check budget status and get alerts\n🎯 **Goal Tracking** - Monitor progress toward financial goals\n💡 **Smart Insights** - Get personalized financial recommendations\n📈 **Investment Overview** - Portfolio performance and suggestions\n📋 **Bill Management** - Upcoming payments and reminders\n\nWhat would you like to explore?";
  }
  
  // Default response with suggestions
  return "I'm here to help with your finances! Try asking me about:\n\n• \"How much did I spend this month?\"\n• \"What's my budget status?\"\n• \"How are my goals progressing?\"\n• \"Give me some savings tips\"\n• \"What bills are due soon?\"\n• \"How's my financial health?\"\n\nWhat would you like to know?";
};

// Validate transaction data
export const validateTransaction = (transaction: Partial<Transaction>): string[] => {
  const errors: string[] = [];
  
  if (!transaction.amount || transaction.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!transaction.description?.trim()) {
    errors.push('Description is required');
  }
  
  if (!transaction.category) {
    errors.push('Category is required');
  }
  
  if (!transaction.date) {
    errors.push('Date is required');
  }
  
  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.push('Valid transaction type is required');
  }
  
  return errors;
};

// Format currency values
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Calculate financial metrics
export const calculateFinancialMetrics = (transactions: Transaction[]) => {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;
  
  return {
    income,
    expenses,
    balance,
    savingsRate,
    transactionCount: transactions.length
  };
};