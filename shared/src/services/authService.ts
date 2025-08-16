import apiClient from './apiClient';
import { User } from '../types/auth';
import { ApiResponse } from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  password: string;
  confirm_password: string;
  user_type: string;
  parent_email?: string;
  date_of_birth?: string;
  gender?: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.access_token) {
      await apiClient.setAuthToken(response.access_token);
    }
    
    return response;
  }

  async register(userData: RegisterData): Promise<User> {
    return apiClient.post<User>('/auth/register', userData);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.warn('Server logout failed:', error);
    } finally {
      await apiClient.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }

  async refreshToken(): Promise<string> {
    const response = await apiClient.post<{ access_token: string }>('/auth/refresh');
    
    if (response.access_token) {
      await apiClient.setAuthToken(response.access_token);
    }
    
    return response.access_token;
  }

  async forgotPassword(email: string): Promise<any> {
    return apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<any> {
    return apiClient.post('/auth/reset-password', { token, password });
  }

  async verifyEmail(token: string): Promise<any> {
    return apiClient.post('/auth/verify-email', { token });
  }

  async resendVerification(email: string): Promise<any> {
    return apiClient.post('/auth/resend-verification', { email });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    return apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return apiClient.patch<User>('/auth/profile', userData);
  }
}

const authService = new AuthService();

export default authService;