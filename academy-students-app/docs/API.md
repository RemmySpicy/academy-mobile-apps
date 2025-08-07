# API Integration Guide

This document outlines the API integration patterns, endpoints, and data models for the Academy Students App. The app integrates with the Academy backend API located at `../academy-admin/backend`.

## 🏗️ API Architecture

### Base Configuration

```typescript
// shared/services/apiClient.ts
export class ApiClient {
  private axios: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for authentication
    this.axios.interceptors.request.use(
      (config) => {
        const token = getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or logout
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }
}
```

### Error Handling Strategy

```typescript
interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
  meta?: {
    pagination?: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  };
}

class ApiService {
  async handleRequest<T>(request: () => Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await request();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.transformError(error);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  private transformError(error: AxiosError): ApiError {
    const response = error.response;
    
    if (response?.data) {
      return {
        message: response.data.message || 'An error occurred',
        code: response.data.code || 'UNKNOWN_ERROR',
        details: response.data.details,
      };
    }

    return {
      message: error.message || 'Network error',
      code: 'NETWORK_ERROR',
    };
  }
}
```

## 🔐 Authentication Endpoints

### Login
```typescript
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  programs: Program[];
}

// POST /auth/login
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return apiClient.post('/auth/login', credentials);
};
```

### Registration
```typescript
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'student' | 'parent';
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface RegisterResponse {
  user: User;
  requiresVerification: boolean;
  verificationMethod: 'email' | 'phone';
}

// POST /auth/register
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  return apiClient.post('/auth/register', data);
};
```

### Token Management
```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// POST /auth/refresh
export const refreshToken = async (token: string): Promise<RefreshTokenResponse> => {
  return apiClient.post('/auth/refresh', { refreshToken: token });
};

// POST /auth/logout
export const logout = async (): Promise<void> => {
  return apiClient.post('/auth/logout');
};
```

## 📚 Course Management Endpoints

### Get Courses
```typescript
interface GetCoursesQuery {
  search?: string;
  category?: 'learn-to-swim' | 'swimming-club' | 'adult-swimming' | 'aqua-babies';
  level?: 'beginner' | 'intermediate' | 'advanced';
  ageGroup?: string;
  page?: number;
  limit?: number;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  ageRange: string;
  duration: number; // minutes
  price: number;
  currency: string;
  maxStudents: number;
  totalSessions: number;
  features: string[];
  curriculum: string[];
  instructor: {
    id: string;
    name: string;
    bio: string;
    certifications: string[];
    experience: string;
    profileImage?: string;
  };
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location: string;
  }[];
  availability: {
    available: boolean;
    nextAvailableDate?: string;
    waitlistAvailable: boolean;
  };
  ratings: {
    average: number;
    count: number;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// GET /courses
export const getCourses = async (query: GetCoursesQuery = {}): Promise<ApiResponse<Course[]>> => {
  const params = new URLSearchParams(query as any).toString();
  return apiClient.get(`/courses?${params}`);
};

// GET /courses/:id
export const getCourseById = async (courseId: string): Promise<Course> => {
  return apiClient.get(`/courses/${courseId}`);
};
```

### Course Availability
```typescript
interface AvailabilityQuery {
  courseId: string;
  startDate: string;
  endDate: string;
}

interface AvailabilitySlot {
  date: string;
  time: string;
  available: boolean;
  spotsRemaining: number;
  waitlistAvailable: boolean;
}

// GET /courses/:id/availability
export const getCourseAvailability = async (query: AvailabilityQuery): Promise<AvailabilitySlot[]> => {
  const { courseId, ...params } = query;
  const queryString = new URLSearchParams(params).toString();
  return apiClient.get(`/courses/${courseId}/availability?${queryString}`);
};
```

## 📅 Booking Management Endpoints

### Create Booking
```typescript
interface CreateBookingRequest {
  courseId: string;
  studentId: string;
  scheduleSlots: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  notes?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  paymentMethodId?: string;
  promoCode?: string;
}

interface Booking {
  id: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    level: string;
    instructor: string;
    location: string;
  };
  studentId: string;
  student: {
    id: string;
    name: string;
    dateOfBirth: string;
  };
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  totalAmount: number;
  currency: string;
  sessions: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
    location: string;
    notes?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// POST /bookings
export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  return apiClient.post('/bookings', data);
};
```

### Get User Bookings
```typescript
interface GetBookingsQuery {
  studentId?: string;
  status?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// GET /bookings
export const getUserBookings = async (query: GetBookingsQuery = {}): Promise<ApiResponse<Booking[]>> => {
  const params = new URLSearchParams(query as any).toString();
  return apiClient.get(`/bookings?${params}`);
};

// GET /bookings/:id
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  return apiClient.get(`/bookings/${bookingId}`);
};
```

### Update Booking
```typescript
interface UpdateBookingRequest {
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// PUT /bookings/:id
export const updateBooking = async (bookingId: string, data: UpdateBookingRequest): Promise<Booking> => {
  return apiClient.put(`/bookings/${bookingId}`, data);
};

// POST /bookings/:id/cancel
export const cancelBooking = async (bookingId: string, reason?: string): Promise<void> => {
  return apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
};
```

### Reschedule Booking
```typescript
interface RescheduleRequest {
  sessionId: string;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  reason?: string;
}

// POST /bookings/:id/reschedule
export const rescheduleBooking = async (bookingId: string, data: RescheduleRequest): Promise<Booking> => {
  return apiClient.post(`/bookings/${bookingId}/reschedule`, data);
};
```

## 📊 Progress Tracking Endpoints

### Get Student Progress
```typescript
interface SkillProgress {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  maxLevel: number;
  description: string;
  milestones: {
    level: number;
    title: string;
    description: string;
    achievedAt?: string;
  }[];
  lastUpdated: string;
}

interface CourseProgress {
  courseId: string;
  courseName: string;
  overallProgress: number;
  completedSessions: number;
  totalSessions: number;
  skills: SkillProgress[];
  instructor: {
    id: string;
    name: string;
  };
  nextMilestone?: {
    skill: string;
    level: number;
    title: string;
    description: string;
  };
  startDate: string;
  estimatedCompletionDate?: string;
}

interface StudentProgress {
  studentId: string;
  overallProgress: number;
  totalSessionsCompleted: number;
  totalSkillsLearned: number;
  achievementsUnlocked: number;
  courses: CourseProgress[];
  recentAchievements: Achievement[];
  upcomingGoals: Goal[];
}

// GET /progress/:studentId
export const getStudentProgress = async (studentId: string): Promise<StudentProgress> => {
  return apiClient.get(`/progress/${studentId}`);
};

// GET /progress/:studentId/courses/:courseId
export const getCourseProgress = async (studentId: string, courseId: string): Promise<CourseProgress> => {
  return apiClient.get(`/progress/${studentId}/courses/${courseId}`);
};
```

### Update Progress
```typescript
interface ProgressUpdate {
  skillId: string;
  newLevel: number;
  notes?: string;
  instructorId: string;
  sessionId: string;
}

// POST /progress/:studentId/skills/:skillId/update
export const updateSkillProgress = async (studentId: string, data: ProgressUpdate): Promise<SkillProgress> => {
  return apiClient.post(`/progress/${studentId}/skills/${data.skillId}/update`, data);
};
```

### Achievements
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'attendance' | 'milestone' | 'social';
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  points: number;
  unlockedAt?: string;
  progress?: {
    current: number;
    total: number;
  };
}

// GET /progress/:studentId/achievements
export const getStudentAchievements = async (studentId: string): Promise<Achievement[]> => {
  return apiClient.get(`/progress/${studentId}/achievements`);
};
```

## 👤 User Profile Endpoints

### Get Profile
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'parent' | 'instructor';
  dateOfBirth?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    language: string;
    timezone: string;
  };
  children?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    relationship: string;
  }[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// GET /users/profile
export const getUserProfile = async (): Promise<User> => {
  return apiClient.get('/users/profile');
};
```

### Update Profile
```typescript
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Partial<User['address']>;
  emergencyContact?: User['emergencyContact'];
  preferences?: Partial<User['preferences']>;
}

// PUT /users/profile
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<User> => {
  return apiClient.put('/users/profile', data);
};
```

### Child Management (Parent Role)
```typescript
interface AddChildRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: 'son' | 'daughter' | 'ward' | 'other';
  notes?: string;
}

interface Child extends AddChildRequest {
  id: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

// POST /users/children
export const addChild = async (data: AddChildRequest): Promise<Child> => {
  return apiClient.post('/users/children', data);
};

// GET /users/children
export const getChildren = async (): Promise<Child[]> => {
  return apiClient.get('/users/children');
};

// PUT /users/children/:id
export const updateChild = async (childId: string, data: Partial<AddChildRequest>): Promise<Child> => {
  return apiClient.put(`/users/children/${childId}`, data);
};
```

## 💳 Payment Endpoints

### Payment Methods
```typescript
interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
  createdAt: string;
}

// GET /payments/methods
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  return apiClient.get('/payments/methods');
};

// POST /payments/methods
export const addPaymentMethod = async (paymentMethodId: string): Promise<PaymentMethod> => {
  return apiClient.post('/payments/methods', { paymentMethodId });
};

// DELETE /payments/methods/:id
export const removePaymentMethod = async (methodId: string): Promise<void> => {
  return apiClient.delete(`/payments/methods/${methodId}`);
};
```

### Payment Processing
```typescript
interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
  clientSecret: string;
}

// POST /payments/intents
export const createPaymentIntent = async (bookingId: string): Promise<PaymentIntent> => {
  return apiClient.post('/payments/intents', { bookingId });
};

// POST /payments/intents/:id/confirm
export const confirmPayment = async (paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> => {
  return apiClient.post(`/payments/intents/${paymentIntentId}/confirm`, { paymentMethodId });
};
```

## 📱 Notifications Endpoints

### Get Notifications
```typescript
interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'booking_reminder' | 'achievement' | 'payment' | 'announcement' | 'progress_update';
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

// GET /notifications
export const getNotifications = async (page = 1, limit = 20): Promise<ApiResponse<Notification[]>> => {
  return apiClient.get(`/notifications?page=${page}&limit=${limit}`);
};

// PUT /notifications/:id/read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  return apiClient.put(`/notifications/${notificationId}/read`);
};

// PUT /notifications/read-all
export const markAllNotificationsAsRead = async (): Promise<void> => {
  return apiClient.put('/notifications/read-all');
};
```

### Push Notification Settings
```typescript
interface PushTokenRequest {
  token: string;
  platform: 'ios' | 'android';
}

// POST /notifications/push-token
export const registerPushToken = async (data: PushTokenRequest): Promise<void> => {
  return apiClient.post('/notifications/push-token', data);
};

// DELETE /notifications/push-token
export const unregisterPushToken = async (): Promise<void> => {
  return apiClient.delete('/notifications/push-token');
};
```

## 🔧 Utility Endpoints

### File Upload
```typescript
interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// POST /uploads
export const uploadFile = async (file: FormData, type: 'profile' | 'document'): Promise<UploadResponse> => {
  return apiClient.post(`/uploads?type=${type}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
```

### App Configuration
```typescript
interface AppConfig {
  maintenanceMode: boolean;
  minimumVersion: {
    ios: string;
    android: string;
  };
  features: {
    paymentEnabled: boolean;
    chatEnabled: boolean;
    achievementsEnabled: boolean;
  };
  supportContact: {
    email: string;
    phone: string;
    hours: string;
  };
}

// GET /config
export const getAppConfig = async (): Promise<AppConfig> => {
  return apiClient.get('/config');
};
```

## 🏗️ Service Implementation Example

```typescript
// features/courses/services/coursesApi.ts
export class CoursesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getCourses(query: GetCoursesQuery = {}) {
    try {
      const response = await this.apiClient.get<ApiResponse<Course[]>>('/courses', {
        params: query,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourseById(courseId: string) {
    try {
      const course = await this.apiClient.get<Course>(`/courses/${courseId}`);
      return course;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error('Failed to fetch courses');
  }
}

// Usage in component
const coursesService = new CoursesService(apiClient);
```

## ⚡ Performance Considerations

### Caching Strategy
- **Memory Cache**: In-memory cache for frequently accessed data
- **Storage Cache**: AsyncStorage cache for offline support
- **HTTP Cache**: Axios cache for API responses
- **Image Cache**: Cached network images for performance

### Request Optimization
- **Request Deduplication**: Avoid duplicate concurrent requests
- **Pagination**: Implement pagination for large datasets
- **Lazy Loading**: Load data as needed
- **Retry Logic**: Automatic retry for failed requests

### Offline Support
- **Cached Data**: Display cached data when offline
- **Queue Requests**: Queue mutations for when online
- **Sync Strategy**: Synchronize data when connection restored
- **Conflict Resolution**: Handle data conflicts on sync

---

This API integration guide provides a comprehensive overview of all endpoints and patterns used in the Academy Students App. All API calls include proper error handling, type safety, and performance optimization.