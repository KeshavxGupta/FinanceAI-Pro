// Authentication service for handling login/signup
class AuthService {
  // Mock user data for demo purposes
  private mockUsers = [
    {
      id: 'demo_user_id_123',
      email: 'demo@financeai.com',
      name: 'Demo User',
      username: 'demouser',
      password: 'demo123' // In real app, this would be hashed
    },
    {
      id: 'user_2',
      email: 'john@example.com',
      name: 'John Doe',
      username: 'johndoe',
      password: 'password123'
    }
  ];

  async login(email: string, password: string) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user by email
      const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      if (user.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Generate mock tokens with user ID
      const tokens = {
        access: this.generateToken(user.id),
        refresh: this.generateToken(user.id)
      };

      // Transform user data
      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.name.split(' ')[0],
        last_name: user.name.split(' ')[1] || '',
        username: user.username
      };

      return { user: userData, tokens };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    username?: string;
  }) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate input
      if (!userData.email || !userData.password || !userData.first_name) {
        throw new Error('All required fields must be filled');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (!this.isValidEmail(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if user already exists
      const existingUser = this.mockUsers.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUserId = `user_${Date.now()}`;
      const newUser = {
        id: newUserId,
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        username: userData.username || userData.email.split('@')[0],
        password: userData.password
      };

      // Add to mock users (in real app, this would be saved to database)
      this.mockUsers.push(newUser);

      // Generate tokens
      const tokens = {
        access: this.generateToken(newUserId),
        refresh: this.generateToken(newUserId)
      };

      // Return user data
      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: newUser.username
      };

      return { user: userResponse, tokens };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Simulate token refresh
      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }

      // In real app, validate refresh token with backend
      const userId = this.decodeToken(refreshToken);
      const newAccessToken = this.generateToken(userId);
      
      return { access: newAccessToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async getProfile(accessToken: string) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simulate profile fetch
      if (!accessToken) {
        throw new Error('No access token provided');
      }

      // Decode token to get user ID
      const userId = this.decodeToken(accessToken);
      
      // Find user in mock data
      const user = this.mockUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        id: user.id,
        email: user.email,
        first_name: user.name.split(' ')[0],
        last_name: user.name.split(' ')[1] || '',
        username: user.username
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string, accessToken: string) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (!oldPassword || !newPassword) {
        throw new Error('Both old and new passwords are required');
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      if (oldPassword === newPassword) {
        throw new Error('New password must be different from the old password');
      }

      // Get user ID from token
      const userId = this.decodeToken(accessToken);
      const user = this.mockUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify old password
      if (user.password !== oldPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password in mock data
      user.password = newPassword;

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (!email || !this.isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if user exists
      const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        // Don't reveal if email exists or not for security
        return { 
          success: true, 
          message: 'If an account with this email exists, password reset instructions have been sent' 
        };
      }

      // Simulate sending reset email
      return { 
        success: true, 
        message: 'Password reset instructions have been sent to your email' 
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Utility methods
  private generateToken(userId: string): string {
    // Generate a mock JWT-like token with specific user ID
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId: userId,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = btoa(Math.random().toString(36));
    
    return `${header}.${payload}.${signature}`;
  }

  private decodeToken(token: string): string {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.userId;
    } catch {
      return 'demo_user_id_123'; // Fallback user ID
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Logout (clear tokens)
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }

  // Get stored access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export const authService = new AuthService();