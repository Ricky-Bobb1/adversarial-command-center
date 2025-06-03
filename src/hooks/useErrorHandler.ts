
import { useCallback } from 'react';
import { useToast } from './use-toast';
import { ApiError } from '../services/api';

interface ErrorHandlerOptions {
  showToast?: boolean;
  customErrorMessages?: Record<number, string>;
  onError?: (error: Error) => void;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { toast } = useToast();
  const { showToast = true, customErrorMessages = {}, onError } = options;

  const handleError = useCallback((error: Error | ApiError, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    let title = "Error";
    let description = "An unexpected error occurred";

    if (error instanceof ApiError) {
      // Handle API errors with specific status codes
      if (error.status && customErrorMessages[error.status]) {
        description = customErrorMessages[error.status];
      } else if (error.status) {
        switch (error.status) {
          case 400:
            title = "Bad Request";
            description = error.message || "Invalid request data";
            break;
          case 401:
            title = "Unauthorized";
            description = "Please check your authentication";
            break;
          case 403:
            title = "Forbidden";
            description = "You don't have permission for this action";
            break;
          case 404:
            title = "Not Found";
            description = "The requested resource was not found";
            break;
          case 429:
            title = "Too Many Requests";
            description = "Please wait before trying again";
            break;
          case 500:
            title = "Server Error";
            description = "Internal server error occurred";
            break;
          default:
            description = error.message || description;
        }
      } else {
        description = error.message || description;
      }
    } else {
      description = error.message || description;
    }

    if (showToast) {
      toast({
        title,
        description,
        variant: "destructive",
      });
    }

    if (onError) {
      onError(error);
    }
  }, [toast, showToast, customErrorMessages, onError]);

  return { handleError };
};
