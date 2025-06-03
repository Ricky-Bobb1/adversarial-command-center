
import { environment } from '../utils/environment';
import { logger } from '../utils/logger';

export class ApiError extends Error {
  status?: number;
  details?: any;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  requestId?: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  signal?: AbortSignal;
}

// Store cancellation tokens for request cancellation
const requestCancellation = {
  tokens: new Map<string, AbortController>(),
  add: (requestId: string, controller: AbortController) => {
    requestCancellation.tokens.set(requestId, controller);
  },
  remove: (requestId: string) => {
    requestCancellation.tokens.delete(requestId);
  },
  cancel: (requestId: string) => {
    const controller = requestCancellation.tokens.get(requestId);
    if (controller) {
      controller.abort();
      requestCancellation.tokens.delete(requestId);
    }
  },
  cancelAll: () => {
    requestCancellation.tokens.forEach((controller) => {
      controller.abort();
    });
    requestCancellation.tokens.clear();
  },
};

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private maxRetries: number;

  constructor() {
    this.baseURL = environment.apiBaseUrl;
    this.defaultTimeout = 10000;
    this.maxRetries = environment.retryAttempts;
    
    logger.info('API Client initialized', 'ApiClient', {
      baseURL: this.baseURL,
      environment: environment.isDevelopment ? 'development' : 'production',
      mockApi: environment.enableMockApi
    });
  }

  private shouldRetry(error: any, attempt: number): boolean {
    if (attempt > this.maxRetries) {
      return false;
    }

    if (error.status === 429) {
      // Retry after a delay if rate limited
      return true;
    }

    if (error.name === 'AbortError') {
      // Don't retry aborted requests
      return false;
    }

    // Retry on network errors or server errors
    return error.status >= 500 || !error.status;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requestId, method = 'GET', headers = {}, data, ...fetchOptions } = options;
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    const startTime = performance.now();
    
    logger.apiRequest(method, fullUrl, data);

    const attempt = headers['x-retry-attempt'] ? parseInt(headers['x-retry-attempt'], 10) : 0;
    const abortController = new AbortController();

    if (requestId) {
      requestCancellation.add(requestId, abortController);
    }

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: abortController.signal,
        ...fetchOptions,
      });

      const duration = performance.now() - startTime;
      logger.performance(`API ${method} ${url}`, duration, 'API');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError = new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
        throw apiError;
      }

      const responseData = await response.json();
      logger.apiResponse(method, fullUrl, response.status, responseData);
      return responseData;
    } catch (error: any) {
      if (this.shouldRetry(error, attempt)) {
        const delayTime = attempt * 1000;
        logger.warn(`Retrying request to ${fullUrl} in ${delayTime}ms (attempt ${attempt + 1})`, 'API', {
          status: error.status,
          message: error.message,
        });

        await new Promise(resolve => setTimeout(resolve, delayTime));

        return this.makeRequest(url, {
          ...options,
          headers: {
            ...headers,
            'x-retry-attempt': (attempt + 1).toString(),
          },
        });
      }

      const apiError = error instanceof ApiError ? error : new ApiError(
        error.message || 'Request failed',
        error.status,
        error
      );
      logger.apiError(method, fullUrl, apiError);
      throw apiError;
    } finally {
      if (requestId) {
        requestCancellation.remove(requestId);
      }
    }
  }

  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, { ...options, method: 'POST', data });
  }

  async put<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, { ...options, method: 'PUT', data });
  }

  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export { requestCancellation };
