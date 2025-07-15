import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { getChatbotResponse } from '../../services/aiService';
import { ChatMessage } from '../../types';
import { useTransactions } from '../../hooks/useTransactions';
import { useBudgets } from '../../hooks/useBudgets';
import { useGoals } from '../../hooks/useGoals';

export const Chatbot: React.FC = () => {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { goals } = useGoals();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: '',
      response: "Hello! I'm your AI financial assistant. I can help you analyze your spending patterns, track budgets, and provide personalized financial insights. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      response: '',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    // Prepare context for AI
    const context = {
      transactions,
      budgets,
      goals,
      totalTransactions: transactions.length,
      totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      activeBudgets: budgets.length,
      activeGoals: goals.filter(g => g.isActive).length
    };

    // Simulate AI response delay for realism
    setTimeout(() => {
      try {
        const response = getChatbotResponse(userMessage, context);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, response }
              : msg
          )
        );
      } catch (error) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, response: "I'm sorry, I encountered an error. Please try asking your question again." }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const suggestedQuestions = [
    "How much did I spend on food this month?",
    "What are my top spending categories?",
    "Am I on track with my budgets?",
    "Give me some savings tips",
    "What's my current financial health?",
    "How are my goals progressing?",
    "What bills are due soon?",
    "Show me my investment performance"
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              AI Financial Assistant
            </h2>
            <p className="text-blue-100 text-sm">
              Ask me anything about your finances
            </p>
          </div>
          <div className="ml-auto">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {message.message && (
                <div className="flex justify-end">
                  <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl rounded-br-md p-4 text-white shadow-lg">
                      <p className="text-sm leading-relaxed">{message.message}</p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              )}
              
              {message.response && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-xs lg:max-w-2xl">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                      <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md p-4 shadow-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-900 dark:text-white leading-relaxed whitespace-pre-line">
                        {message.response}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md p-4 shadow-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && !isLoading && (
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">💡 Try asking:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your finances..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            disabled={isLoading}
            maxLength={500}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {input.length}/500 characters
        </p>
      </div>
    </div>
  );
};