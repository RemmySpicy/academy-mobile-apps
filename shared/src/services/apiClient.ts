import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, AuthError } from '../types/auth';
import { ApiResponse } from '../types';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

/**
 * Environment-based API configuration
 */
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * HTTP status codes that should trigger automatic logout
 */
const AUTH_FAILURE_CODES = [401, 403] as const;

/**
 * HTTP status codes that should be retried
 */
const RETRYABLE_CODES = [408, 429, 500, 502, 503, 504] as const;

/**
 * Enhanced API Client with modern authentication integration
 */
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private retryCount: Map<string, number> = new Map();

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup axios interceptors for authentication and error handling
   */
  private setupInterceptors() {
    // Request interceptor - add auth token and program context
    this.client.interceptors.request.use(
      async (config) => {
        try {
          // Get auth state from Zustand store
          const authState = useAuthStore.getState();
          const { token, currentProgram } = authState;

          // Add authorization header
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          // Add program context header
          if (currentProgram?.program_id) {
            config.headers['X-Program-Context'] = currentProgram.program_id;
          }

          // Add request ID for tracking
          config.headers['X-Request-ID'] = this.generateRequestId();
          
          // Log request in development
          if (__DEV__) {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
              headers: config.headers,
              data: config.data,
            });
          }
        } catch (error) {
          console.warn('Failed to setup request headers:', error);
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(this.createApiError(error));
      }
    );

    // Response interceptor - handle authentication and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (__DEV__) {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }
        
        // Clear retry count on successful response
        const requestId = response.config.headers?.['X-Request-ID'] as string;
        if (requestId) {
          this.retryCount.delete(requestId);
        }
        
        return response;
      },
      async (error) => {
        const response = error.response;
        const status = response?.status || 0;
        const requestId = error.config?.headers?.['X-Request-ID'] as string;
        
        if (__DEV__) {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status,
            message: response?.data?.message || error.message,
            data: response?.data,
          });
        }

        // Handle authentication failures
        if (AUTH_FAILURE_CODES.includes(status)) {
          await this.handleAuthFailure(status);
        }

        // Handle retryable errors
        if (this.shouldRetry(error, requestId)) {
          return this.retryRequest(error);
        }

        // Create enhanced error and show notification
        const apiError = this.createApiError(error);
        this.handleErrorNotification(apiError);
        
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Generate unique request ID for tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create enhanced API error from axios error
   */
  private createApiError(error: any): ApiError {
    return ApiError.fromResponse(error);
  }

  /**
   * Handle authentication failures by triggering logout
   */
  private async handleAuthFailure(status: number): Promise<void> {
    try {
      const authStore = useAuthStore.getState();
      const notificationStore = useNotificationStore.getState();
      
      if (status === 401) {
        // Token expired or invalid - logout user
        await authStore.logout();
        notificationStore.showError(
          'Your session has expired. Please log in again.',
          'Session Expired'
        );
      } else if (status === 403) {
        // Insufficient permissions
        notificationStore.showError(
          'You do not have permission to perform this action.',
          'Access Denied'
        );
      }
    } catch (error) {
      console.error('Failed to handle auth failure:', error);
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: any, requestId: string): boolean {
    const status = error.response?.status || 0;
    const currentRetries = this.retryCount.get(requestId) || 0;
    
    return (
      RETRYABLE_CODES.includes(status) &&
      currentRetries < API_CONFIG.RETRY_ATTEMPTS &&
      !error.config.__isRetryRequest
    );
  }

  /**
   * Retry failed request with exponential backoff
   */
  private async retryRequest(error: any): Promise<AxiosResponse> {
    const requestId = error.config.headers['X-Request-ID'];
    const currentRetries = this.retryCount.get(requestId) || 0;
    const nextRetryCount = currentRetries + 1;
    
    this.retryCount.set(requestId, nextRetryCount);
    
    // Exponential backoff: delay = base_delay * (2 ^ retry_count)
    const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, currentRetries);
    
    console.log(`🔄 Retrying request (${nextRetryCount}/${API_CONFIG.RETRY_ATTEMPTS}) after ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Mark as retry request to prevent infinite loops
    error.config.__isRetryRequest = true;
    
    return this.client(error.config);
  }

  /**
   * Handle error notifications based on error type and settings
   */
  private handleErrorNotification(error: ApiError): void {
    try {
      const notificationStore = useNotificationStore.getState();
      
      // Don't show notifications for certain status codes
      const silentCodes = [401, 403]; // Auth errors are handled separately
      if (silentCodes.includes(error.status)) {
        return;
      }
      
      // Show field-specific errors
      if (error.hasFieldErrors()) {
        error.getFieldErrorMessages().forEach(message => {
          notificationStore.showError(message, 'Validation Error');
        });
        return;
      }
      
      // Show general error notification
      const title = this.getErrorTitle(error.status);
      const message = error.getUserMessage();
      
      if (error.isServerError) {
        notificationStore.showError(message, title, 10000); // Longer duration for server errors
      } else {
        notificationStore.showError(message, title);
      }
    } catch (notificationError) {
      console.error('Failed to show error notification:', notificationError);
    }
  }

  /**
   * Get appropriate error title based on status code
   */
  private getErrorTitle(status: number): string {
    switch (status) {
      case 400: return 'Bad Request';
      case 404: return 'Not Found';
      case 409: return 'Conflict';
      case 422: return 'Validation Error';
      case 500: return 'Server Error';
      case 0: return 'Network Error';
      default: return 'Error';
    }
  }

  /**
   * Enhanced HTTP methods with better error handling and typing
   */
  async get<T = any>(
    url: string, 
    config?: AxiosRequestConfig & { silent?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      if (config?.silent) {
        // Suppress notifications for silent requests
        const apiError = this.createApiError(error);
        throw apiError;
      }
      throw error; // Re-throw to let interceptor handle it
    }
  }

  async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { silent?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      if (config?.silent) {
        const apiError = this.createApiError(error);
        throw apiError;
      }
      throw error;
    }
  }

  async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { silent?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      if (config?.silent) {
        const apiError = this.createApiError(error);
        throw apiError;
      }
      throw error;
    }
  }

  async patch<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { silent?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      if (config?.silent) {
        const apiError = this.createApiError(error);
        throw apiError;
      }
      throw error;
    }
  }

  async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig & { silent?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      if (config?.silent) {
        const apiError = this.createApiError(error);
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Utility methods for API client management
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.client.defaults.baseURL = url;
    console.log(`📡 API Base URL updated to: ${url}`);
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Set request timeout
   */
  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }

  /**
   * Get current authentication headers
   */
  getAuthHeaders(): Record<string, string> {
    const authState = useAuthStore.getState();
    return authState.getAuthHeaders();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const authState = useAuthStore.getState();
    return authState.isAuthenticated;
  }

  /**
   * Get current program context
   */
  getCurrentProgram(): any {
    const authState = useAuthStore.getState();
    return authState.currentProgram;
  }

  /**
   * Set program context with persistence
   */
  async setProgramContext(programId: string): Promise<void> {
    try {
      // Import AsyncStorage dynamically to avoid issues in web environments
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem('program_context', programId);
    } catch (error) {
      console.warn('Failed to persist program context:', error);
      // Don't throw - persistence failure shouldn't break the app
    }
  }

  /**
   * Get stored program context
   */
  async getProgramContext(): Promise<string | null> {
    try {
      // Import AsyncStorage dynamically to avoid issues in web environments  
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return await AsyncStorage.getItem('program_context');
    } catch (error) {
      console.warn('Failed to retrieve program context:', error);
      return null;
    }
  }

  /**
   * Clear stored program context
   */
  async clearProgramContext(): Promise<void> {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.removeItem('program_context');
    } catch (error) {
      console.warn('Failed to clear program context:', error);
      // Don't throw - persistence failure shouldn't break the app
    }
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = any>(
    url: string,
    file: FormData,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, file, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
    });
    return response.data;
  }

  /**
   * Download file with progress tracking
   */
  async downloadFile(
    url: string,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<Blob> {
    const response = await this.client.get(url, {
      ...config,
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
    });
    return response.data;
  }

  /**
   * Clear all retry counts (useful for testing)
   */
  clearRetryCache(): void {
    this.retryCount.clear();
  }

  /**
   * Get current retry statistics
   */
  getRetryStats(): { activeRetries: number; totalRequests: number } {
    return {
      activeRetries: this.retryCount.size,
      totalRequests: Array.from(this.retryCount.values()).reduce((sum, count) => sum + count, 0),
    };
  }
}

/**
 * Create and export singleton API client instance
 */
const apiClient = new ApiClient();

// Enhanced error types export
export { ApiError, AuthError } from '../types/auth';

// Type exports for better TypeScript support
export type {
  ApiResponse,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type EnhancedRequestConfig = AxiosRequestConfig & {
  silent?: boolean;
};

/**
 * API client hooks for React components
 */
export const useApiClient = () => {
  return {
    client: apiClient,
    isAuthenticated: apiClient.isAuthenticated(),
    currentProgram: apiClient.getCurrentProgram(),
    authHeaders: apiClient.getAuthHeaders(),
    retryStats: apiClient.getRetryStats(),
  };
};

/**
 * Convenience functions for common API patterns
 */
export const api = {
  // Standard HTTP methods
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  
  // File operations
  upload: apiClient.uploadFile.bind(apiClient),
  download: apiClient.downloadFile.bind(apiClient),
  
  // Utility methods
  setBaseURL: apiClient.setBaseURL.bind(apiClient),
  setTimeout: apiClient.setTimeout.bind(apiClient),
  getBaseURL: apiClient.getBaseURL.bind(apiClient),
  clearRetryCache: apiClient.clearRetryCache.bind(apiClient),
};

export default apiClient;