
/**
 * Environment configuration utility
 * Handles development vs production environment settings
 */

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  apiBaseUrl: string;
  enableMockApi: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  cacheTimeout: number;
  retryAttempts: number;
}

class Environment {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EnvironmentConfig {
    const mode = import.meta.env.MODE;
    const isDevelopment = mode === 'development';
    const isProduction = mode === 'production';
    const isTest = mode === 'test';

    // Default to FastAPI backend URL
    const defaultApiUrl = isDevelopment 
      ? 'http://localhost:8000'  // Local FastAPI dev server
      : 'https://api.adversa-ai.com'; // Production API Gateway

    return {
      isDevelopment,
      isProduction,
      isTest,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || defaultApiUrl,
      enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true' || (isDevelopment && !import.meta.env.VITE_API_BASE_URL),
      logLevel: (import.meta.env.VITE_LOG_LEVEL as any) || (isDevelopment ? 'debug' : 'info'),
      cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT || '300000'), // 5 minutes default
      retryAttempts: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS || '3'),
    };
  }

  get isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  get isProduction(): boolean {
    return this.config.isProduction;
  }

  get isTest(): boolean {
    return this.config.isTest;
  }

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  get enableMockApi(): boolean {
    return this.config.enableMockApi;
  }

  get logLevel(): string {
    return this.config.logLevel;
  }

  get cacheTimeout(): number {
    return this.config.cacheTimeout;
  }

  get retryAttempts(): number {
    return this.config.retryAttempts;
  }

  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }
}

export const environment = new Environment();
