# API Client

The Academy Mobile Apps use a sophisticated, type-safe API client that handles authentication, error management, notifications, and program context automatically.

## 🎯 Overview

The API client provides:
- **Automatic Authentication** - JWT tokens and headers managed automatically
- **Program Context** - X-Program-Context header for multi-program support
- **Error Handling** - Comprehensive error parsing and user notifications
- **Type Safety** - Full TypeScript support with generic methods
- **Retry Logic** - Exponential backoff for transient failures
- **Performance** - Request/response caching and optimization

## 🏗️ Architecture

### Client Structure
```
┌─────────────────────────────────────┐
│             API Client              │
├─────────────────────────────────────┤
│  - Authentication Integration       │
│  - Program Context Management       │
│  - Error Handling & Notifications   │
│  - Request/Response Interception    │
│  - Type-Safe HTTP Methods           │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│          Backend API                │
│     (Academy Management System)     │
└─────────────────────────────────────┘
```

### Key Features
- **Zustand Integration** - Works seamlessly with auth and notification stores
- **Automatic Headers** - Auth tokens and program context added automatically
- **Error Classification** - Distinguishes between network, auth, and application errors
- **Retry Strategies** - Smart retry logic for different error types
- **Notification Integration** - Automatic success/error notifications

## 🚀 Basic Usage

### Simple API Calls

```typescript
import { apiClient } from '@shared';

// GET request with automatic auth headers
const students = await apiClient.get<Student[]>('/students');

// POST request with data
const newStudent = await apiClient.post<Student>('/students', {
  name: 'John Doe',
  email: 'john@example.com',
  program_id: 'swimming_academy'
});

// PUT request for updates
const updatedStudent = await apiClient.put<Student>(`/students/${studentId}`, {
  name: 'John Smith'
});

// DELETE request
await apiClient.delete(`/students/${studentId}`);
```

### With Program Context

```typescript
// Automatically uses current program context from auth store
const courses = await apiClient.get<Course[]>('/courses');

// Override program context for specific request
const otherProgramCourses = await apiClient.get<Course[]>('/courses', {
  programId: 'tennis_academy'
});
```

## 🔧 Advanced Usage

### Custom Headers and Configuration

```typescript
// Request with custom headers
const data = await apiClient.get<any>('/special-endpoint', {
  headers: {
    'Custom-Header': 'value',
    'Another-Header': 'another-value'
  }
});

// Request with timeout override
const data = await apiClient.post<any>('/slow-endpoint', postData, {
  timeout: 30000 // 30 seconds
});

// Request with retry configuration
const data = await apiClient.get<any>('/unreliable-endpoint', {
  retries: 5,
  retryDelay: 1000
});
```

### File Upload

```typescript
// Upload single file
const formData = new FormData();
formData.append('file', {
  uri: fileUri,
  type: 'image/jpeg',
  name: 'profile.jpg'
} as any);

const uploadResult = await apiClient.post<UploadResponse>('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  onUploadProgress: (progress) => {
    console.log('Upload progress:', progress);
  }
});

// Upload multiple files
const multipleFiles = new FormData();
files.forEach((file, index) => {
  multipleFiles.append(`files[${index}]`, file);
});

const batchUpload = await apiClient.post<BatchUploadResponse>(
  '/upload/batch', 
  multipleFiles
);
```

### Download Files

```typescript
// Download file with progress tracking
const fileData = await apiClient.get<Blob>('/files/document.pdf', {
  responseType: 'blob',
  onDownloadProgress: (progress) => {
    const percentComplete = (progress.loaded / progress.total) * 100;
    console.log(`Download progress: ${percentComplete}%`);
  }
});

// Save file locally (React Native specific)
import { downloadFile } from '@shared/utils';

const downloadPath = await apiClient.downloadFile('/files/report.pdf', {
  fileName: 'monthly-report.pdf',
  directory: 'downloads'
});
```

## 🔐 Authentication Integration

### Automatic Token Management

```typescript
// Tokens are managed automatically by the auth store
// No need to manually handle Authorization headers

// Example: The following request automatically includes:
// Authorization: Bearer <access_token>
// X-Program-Context: <current_program_id>
const protectedData = await apiClient.get('/protected-endpoint');
```

### Manual Auth Handling (Rare Cases)

```typescript
// Override auth for specific request (rarely needed)
const publicData = await apiClient.get('/public-endpoint', {
  skipAuth: true // Skip automatic auth headers
});

// Use different token (for service-to-service calls)
const serviceData = await apiClient.get('/service-endpoint', {
  token: serviceToken
});
```

## 🌐 Program Context

### Automatic Context

```typescript
// Uses current program from auth store automatically
const { setCurrentProgram } = useAuthStore();

// Set program context
setCurrentProgram(swimmingProgram);

// All subsequent requests will include X-Program-Context header
const students = await apiClient.get<Student[]>('/students');
// Header: X-Program-Context: swimming_program_id
```

### Manual Context Override

```typescript
// Override program context for specific request
const tennisStudents = await apiClient.get<Student[]>('/students', {
  programId: 'tennis_program_id'
});

// Multiple requests with different contexts
const [swimmingData, tennisData] = await Promise.all([
  apiClient.get('/analytics', { programId: 'swimming_program' }),
  apiClient.get('/analytics', { programId: 'tennis_program' })
]);
```

## 🚨 Error Handling

### Automatic Error Handling

```typescript
try {
  const data = await apiClient.get('/some-endpoint');
  // Success notification shown automatically for POST/PUT/DELETE
} catch (error) {
  // Error notification shown automatically
  // Handle specific error cases if needed
  if (error instanceof ApiError) {
    if (error.status === 404) {
      // Handle not found specifically
    } else if (error.status === 403) {
      // Handle permission denied
    }
  }
}
```

### Error Types

```typescript
import { ApiError, AuthError, NetworkError } from '@shared';

try {
  await apiClient.post('/endpoint', data);
} catch (error) {
  if (error instanceof AuthError) {
    // Authentication/authorization errors
    console.log('Auth error:', error.code, error.message);
  } else if (error instanceof ApiError) {
    // API response errors (4xx, 5xx)
    console.log('API error:', error.status, error.message);
  } else if (error instanceof NetworkError) {
    // Network connectivity errors
    console.log('Network error:', error.message);
  }
}
```

### Custom Error Handling

```typescript
// Disable automatic error notifications for specific request
try {
  const data = await apiClient.get('/endpoint', {
    silentErrors: true
  });
} catch (error) {
  // Handle error manually without automatic notification
  showCustomError(error.message);
}

// Custom error retry logic
const fetchWithRetry = async (url: string, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiClient.get(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Wait with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};
```

## 📊 Response Types and Generics

### Type-Safe Responses

```typescript
interface Student {
  id: string;
  name: string;
  email: string;
  program_id: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Type-safe API calls
const student = await apiClient.get<Student>(`/students/${id}`);
const students = await apiClient.get<PaginatedResponse<Student>>('/students');

// TypeScript knows the response types
console.log(student.name); // ✅ Type-safe
console.log(students.data[0].email); // ✅ Type-safe
```

### Generic Utility Types

```typescript
// Common response patterns
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type ListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

// Usage
const response = await apiClient.get<ApiResponse<Student>>('/students/1');
const list = await apiClient.get<ListResponse<Course>>('/courses');
```

## 🔄 Request/Response Interceptors

### Global Request Modification

```typescript
// Add custom headers to all requests
apiClient.addRequestInterceptor((config) => {
  config.headers['X-Client-Version'] = '2.0.0';
  config.headers['X-Platform'] = Platform.OS;
  return config;
});

// Modify requests based on conditions
apiClient.addRequestInterceptor((config) => {
  if (config.url?.includes('/analytics')) {
    config.timeout = 30000; // Longer timeout for analytics
  }
  return config;
});
```

### Response Processing

```typescript
// Transform responses globally
apiClient.addResponseInterceptor((response) => {
  // Add metadata to all responses
  response.data._requestTimestamp = new Date().toISOString();
  return response;
});

// Handle specific response patterns
apiClient.addResponseInterceptor((response) => {
  // Unwrap data from wrapper responses
  if (response.data && response.data.success && response.data.data) {
    response.data = response.data.data;
  }
  return response;
});
```

## 🧪 Testing

### Mocking API Client

```typescript
import { apiClient } from '@shared';

// Mock the entire API client
jest.mock('@shared', () => ({
  ...jest.requireActual('@shared'),
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

// Type-safe mocking
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

test('handles API call correctly', async () => {
  const mockStudent = { id: '1', name: 'John Doe' };
  mockApiClient.get.mockResolvedValue(mockStudent);
  
  const result = await getStudent('1');
  
  expect(mockApiClient.get).toHaveBeenCalledWith('/students/1');
  expect(result).toEqual(mockStudent);
});
```

### Testing Error Scenarios

```typescript
test('handles API errors correctly', async () => {
  const mockError = new ApiError(404, 'Student not found');
  mockApiClient.get.mockRejectedValue(mockError);
  
  await expect(getStudent('999')).rejects.toThrow('Student not found');
  
  // Verify error notification was shown
  expect(showError).toHaveBeenCalledWith('Student not found');
});
```

### Integration Testing

```typescript
// Use Mock Service Worker for integration tests
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('/api/v1/students', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches students from API', async () => {
  const students = await apiClient.get('/students');
  expect(students).toHaveLength(2);
});
```

## 📱 Platform Considerations

### Network Handling

```typescript
// Check network connectivity
import NetInfo from '@react-native-community/netinfo';

apiClient.addRequestInterceptor(async (config) => {
  const netInfo = await NetInfo.fetch();
  
  if (!netInfo.isConnected) {
    throw new NetworkError('No internet connection');
  }
  
  return config;
});
```

### Background/Foreground Handling

```typescript
import { AppState } from 'react-native';

// Refresh auth token when app comes to foreground
AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'active') {
    apiClient.refreshAuthToken();
  }
});
```

## 🔧 Configuration

### Environment-Based Configuration

```typescript
// API client automatically uses environment-based URLs
const config = {
  development: 'http://localhost:8000/api/v1',
  staging: 'https://staging-api.academy.com/api/v1',
  production: 'https://api.academy.com/api/v1'
};

// Automatically selected based on app environment
```

### Custom Configuration

```typescript
// Override default configuration
apiClient.configure({
  baseURL: 'https://custom-api.example.com',
  timeout: 15000,
  retries: 3,
  retryDelay: 2000,
  enableNotifications: true,
  enableLogging: __DEV__
});
```

## 🚀 Performance Optimization

### Request Caching

```typescript
// Cache GET requests automatically
const students = await apiClient.get('/students', {
  cache: true,
  cacheTimeout: 5 * 60 * 1000 // 5 minutes
});

// Manual cache management
apiClient.clearCache('/students');
apiClient.clearAllCache();
```

### Request Deduplication

```typescript
// Automatic deduplication of identical concurrent requests
const [result1, result2, result3] = await Promise.all([
  apiClient.get('/heavy-endpoint'),
  apiClient.get('/heavy-endpoint'), // Same request, deduped
  apiClient.get('/heavy-endpoint')  // Same request, deduped
]);
// Only one actual HTTP request is made
```

### Batch Requests

```typescript
// Batch multiple requests into one
const batchResults = await apiClient.batch([
  { method: 'GET', url: '/students' },
  { method: 'GET', url: '/courses' },
  { method: 'GET', url: '/instructors' }
]);

const [students, courses, instructors] = batchResults;
```

The API client provides a robust, type-safe, and user-friendly interface for all HTTP communications in the Academy Mobile Apps, handling the complexities of authentication, error management, and user feedback automatically.