
import { format as formatDate } from 'date-fns';

/**
 * Safely parses a date string and returns a Date object
 * @param dateString The date string to parse
 * @param fallback Optional fallback date
 * @returns A Date object
 */
export const safeParseDate = (dateString: string | null | undefined, fallback = new Date()): Date => {
  if (!dateString) return fallback;
  try {
    return new Date(dateString);
  } catch (e) {
    console.error('Error parsing date:', e);
    return fallback;
  }
};

/**
 * Safely formats a date using date-fns format function
 * @param date The date to format
 * @param formatString The format string to use
 * @param fallbackText Text to return if date is invalid
 * @returns Formatted date string
 */
export const safeFormat = (
  date: Date | string | null | undefined, 
  formatString: string, 
  fallbackText = 'N/A'
): string => {
  if (!date) return fallbackText;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDate(dateObj, formatString);
  } catch (e) {
    console.error('Error formatting date:', e);
    return fallbackText;
  }
};
