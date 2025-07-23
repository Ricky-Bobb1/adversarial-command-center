/**
 * Utility functions for consistent data formatting across the application
 */

/**
 * Formats a percentage value by rounding to the nearest whole number
 * @param value - The percentage value (0-100)
 * @param includeSymbol - Whether to include the % symbol (default: true)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, includeSymbol: boolean = true): string => {
  const rounded = Math.round(value);
  return includeSymbol ? `${rounded}%` : rounded.toString();
};

/**
 * Formats a percentage value for display while preserving the original value for calculations
 * @param value - The percentage value (0-100)
 * @returns Object with display value and original value
 */
export const formatPercentageWithOriginal = (value: number) => {
  return {
    display: formatPercentage(value),
    original: value
  };
};

/**
 * Formats duration in seconds to a readable format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
};

/**
 * Formats a number for display with appropriate suffixes (K, M, B)
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};