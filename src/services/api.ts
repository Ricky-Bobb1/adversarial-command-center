import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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

interface RequestOptions extends AxiosRequestConfig {
  requestId?: string;
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
  private instance: AxiosInstance;

  constructor() {
    this.baseURL = environment.apiBaseUrl;
    this.defaultTimeout = 10000;
    this.maxRetries = environment.retryAttempts;

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.defaultTimeout,
    });
    
    logger.info('API Client initialized', 'ApiClient', {
      baseURL: this.baseURL,
      environment: environment.isDevelopment ? 'development' : 'production',
      mockApi: environment.enableMockApi
    });
  }

  private shouldRetry(error: AxiosError, attempt: number): boolean {
    if (attempt > this.maxRetries) {
      return false;
    }

    if (error.response?.status === 429) {
      // Retry after a delay if rate limited
      return true;
    }

    if (error.code === 'ECONNABORTED') {
      // Retry if request timed out
      return true;
    }

    return false;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requestId, ...axiosOptions } = options;
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    const startTime = performance.now();
    
    logger.apiRequest(axiosOptions.method || 'GET', fullUrl, axiosOptions.data);

    const attempt = axiosOptions.headers?.['x-retry-attempt'] ? parseInt(axiosOptions.headers['x-retry-attempt'] as string, 10) : 0;
    const abortController = new AbortController();

    if (requestId) {
      requestCancellation.add(requestId, abortController);
    }

    try {
      const response: AxiosResponse<T> = await this.instance(fullUrl, {
        ...axiosOptions,
        signal: abortController.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(axiosOptions.headers || {}),
        },
      });

      const duration = performance.now() - startTime;
      logger.performance(`API ${axiosOptions.method || 'GET'} ${url}`, duration, 'API');

      logger.apiResponse(axiosOptions.method || 'GET', fullUrl, response.status, response.data);
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError;

      if (this.shouldRetry(axiosError, attempt)) {
        const delayTime = attempt * 1000;
        logger.warn(`Retrying request to ${fullUrl} in ${delayTime}ms (attempt ${attempt + 1})`, 'API', {
          status: axiosError.response?.status,
          message: axiosError.message,
        });

        await new Promise(resolve => setTimeout(resolve, delayTime));

        return this.makeRequest(url, {
          ...axiosOptions,
          headers: {
            ...axiosOptions.headers,
            'x-retry-attempt': attempt + 1,
          },
        });
      }

      const apiError = new ApiError(
        axiosError.message || 'Request failed',
        axiosError.response?.status,
        axiosError.response?.data
      );
      logger.apiError(axiosOptions.method || 'GET', fullUrl, apiError);
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
