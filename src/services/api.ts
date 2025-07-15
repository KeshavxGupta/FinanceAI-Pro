const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken();
        if (!refreshed) {
          // Redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.reload();
          return;
        }
        // Retry the original request would need to be handled by the caller
        throw new Error('Token refreshed, retry request');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Request failed');
    }
    
    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
    return this.handleResponse(response);
  }

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data: any) {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPassword,
      }),
    });
    return this.handleResponse(response);
  }

  // Transaction endpoints
  async getTransactions(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    const response = await fetch(`${API_BASE_URL}/transactions/${queryString}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createTransaction(data: any) {
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateTransaction(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteTransaction(id: string) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
  }

  // Budget endpoints
  async getBudgets() {
    const response = await fetch(`${API_BASE_URL}/budgets/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createBudget(data: any) {
    const response = await fetch(`${API_BASE_URL}/budgets/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateBudget(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteBudget(id: string) {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete budget');
    }
  }

  // Goals endpoints
  async getGoals() {
    const response = await fetch(`${API_BASE_URL}/goals/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createGoal(data: any) {
    const response = await fetch(`${API_BASE_URL}/goals/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateGoal(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/goals/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteGoal(id: string) {
    const response = await fetch(`${API_BASE_URL}/goals/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete goal');
    }
  }

  // AI endpoints
  async getAIInsights() {
    const response = await fetch(`${API_BASE_URL}/ai/insights/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async chatWithAI(message: string, conversationId?: string) {
    const response = await fetch(`${API_BASE_URL}/ai/chat/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ 
        message, 
        conversation_id: conversationId 
      }),
    });
    return this.handleResponse(response);
  }

  async getFinancialHealthScore() {
    const response = await fetch(`${API_BASE_URL}/ai/health-score/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Analytics endpoints
  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getSpendingTrends(period: string = '6months') {
    const response = await fetch(`${API_BASE_URL}/analytics/spending-trends/?period=${period}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getCategoryBreakdown(period: string = 'month') {
    const response = await fetch(`${API_BASE_URL}/analytics/category-breakdown/?period=${period}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Bills endpoints
  async getBills() {
    const response = await fetch(`${API_BASE_URL}/bills/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createBill(data: any) {
    const response = await fetch(`${API_BASE_URL}/bills/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateBill(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/bills/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async markBillAsPaid(id: string) {
    const response = await fetch(`${API_BASE_URL}/bills/${id}/mark-paid/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Investments endpoints
  async getInvestments() {
    const response = await fetch(`${API_BASE_URL}/investments/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createInvestment(data: any) {
    const response = await fetch(`${API_BASE_URL}/investments/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateInvestment(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/investments/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteInvestment(id: string) {
    const response = await fetch(`${API_BASE_URL}/investments/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete investment');
    }
  }
}

export const apiService = new ApiService();