
/**
 * Structured logging system for better debugging
 * Provides consistent logging across the application
 */

import { environment } from './environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    this.logLevel = environment.logLevel as LogLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private createLogEntry(level: LogLevel, message: string, context?: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      error,
    };
  }

  private addToHistory(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  private formatMessage(entry: LogEntry): string {
    const prefix = entry.context ? `[${entry.context}]` : '';
    return `${prefix} ${entry.message}`;
  }

  debug(message: string, context?: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, context, data);
    this.addToHistory(entry);
    console.debug(this.formatMessage(entry), data || '');
  }

  info(message: string, context?: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, context, data);
    this.addToHistory(entry);
    console.info(this.formatMessage(entry), data || '');
  }

  warn(message: string, context?: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, context, data);
    this.addToHistory(entry);
    console.warn(this.formatMessage(entry), data || '');
  }

  error(message: string, context?: string, error?: Error, data?: any): void {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, context, data, error);
    this.addToHistory(entry);
    console.error(this.formatMessage(entry), error || '', data || '');
  }

  // API specific logging methods
  apiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, 'API', data);
  }

  apiResponse(method: string, url: string, status: number, data?: any): void {
    this.debug(`API Response: ${method} ${url} - ${status}`, 'API', data);
  }

  apiError(method: string, url: string, error: Error): void {
    this.error(`API Error: ${method} ${url}`, 'API', error);
  }

  // Component lifecycle logging
  componentMount(componentName: string): void {
    this.debug(`Component mounted: ${componentName}`, 'Component');
  }

  componentUnmount(componentName: string): void {
    this.debug(`Component unmounted: ${componentName}`, 'Component');
  }

  // Performance logging
  performance(operation: string, duration: number, context?: string): void {
    this.info(`Performance: ${operation} took ${duration}ms`, context || 'Performance');
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.logs];
    return this.logs.filter(log => log.level === level);
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
