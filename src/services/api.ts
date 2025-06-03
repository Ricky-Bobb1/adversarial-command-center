
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for simulation requests
  headers: {
    'Content-Type': 'application/json',
  },
  retries: 3,
  retryDelay: 1000, // 1 second
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request cancellation support
export class RequestCancellation {
  private controllers = new Map<string, AbortController>();

  createController(requestId: string): AbortController {
    this.cancelRequest(requestId); // Cancel existing request if any
    const controller = new AbortController();
    this.controllers.set(requestId, controller);
    return controller;
  }

  cancelRequest(requestId: string): void {
    const controller = this.controllers.get(requestId);
    if (controller) {
      controller.abort();
      this.controllers.delete(requestId);
    }
  }

  cancelAll(): void {
    this.controllers.forEach(controller => controller.abort());
    this.controllers.clear();
  }
}

export const requestCancellation = new RequestCancellation();

// Retry mechanism
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = apiConfig.retries,
  delay: number = apiConfig.retryDelay
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if it's the last attempt or error is not retryable
      if (attempt === maxRetries || (error instanceof ApiError && !error.isRetryable)) {
        break;
      }

      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        break;
      }

      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// Enhanced API client with improved error handling and retry logic
export const apiClient = {
  async request<T>(
    endpoint: string, 
    options: RequestInit & { requestId?: string; retries?: number } = {}
  ): Promise<T> {
    const { requestId = `${Date.now()}-${Math.random()}`, retries, ...fetchOptions } = options;
    const url = `${apiConfig.baseURL}${endpoint}`;
    
    const controller = requestCancellation.createController(requestId);
    
    const config: RequestInit = {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        ...apiConfig.headers,
        ...fetchOptions.headers,
      },
    };

    console.log(`API Request: ${config.method || 'GET'} ${url}`);
    
    return withRetry(async () => {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const isRetryable = response.status >= 500 || response.status === 429; // Server errors or rate limiting
          
          throw new ApiError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData,
            isRetryable
          );
        }
        
        const data = await response.json();
        requestCancellation.cancelRequest(requestId); // Clean up successful request
        return data;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new ApiError('Request was cancelled', 0, null, false);
        }
        if (error instanceof ApiError) {
          throw error;
        }
        console.error('API Request failed:', error);
        throw new ApiError('Network error or server unavailable', 0, null, true);
      }
    }, retries);
  },

  async get<T>(endpoint: string, options?: RequestInit & { requestId?: string }): Promise<T> {
    return apiClient.request<T>(endpoint, { ...options, method: 'GET' });
  },

  async post<T>(endpoint: string, data?: any, options?: RequestInit & { requestId?: string }): Promise<T> {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put<T>(endpoint: string, data?: any, options?: RequestInit & { requestId?: string }): Promise<T> {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete<T>(endpoint: string, options?: RequestInit & { requestId?: string }): Promise<T> {
    return apiClient.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
