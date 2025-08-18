/**
 * useDebounce Hook
 * 
 * A React hook that debounces a value to limit the rate of updates.
 * Useful for search inputs, API calls, and expensive calculations.
 */

import { useEffect, useState, useRef, useCallback } from 'react';

export interface UseDebounceOptions {
  /** Debounce delay in milliseconds */
  delay?: number;
  /** Whether to trigger on leading edge */
  leading?: boolean;
  /** Whether to trigger on trailing edge */
  trailing?: boolean;
  /** Maximum wait time in milliseconds */
  maxWait?: number;
}

/**
 * Debounce a value
 */
export function useDebounce<T>(
  value: T,
  delay: number = 500,
  options?: Omit<UseDebounceOptions, 'delay'>
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const {
    leading = false,
    trailing = true,
    maxWait,
  } = options || {};

  useEffect(() => {
    const handler = setTimeout(() => {
      if (trailing) {
        setDebouncedValue(value);
      }
    }, delay);

    // Handle leading edge
    if (leading && debouncedValue !== value) {
      setDebouncedValue(value);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, leading, trailing, debouncedValue]);

  // Handle maxWait
  useEffect(() => {
    if (maxWait) {
      const maxWaitTimeout = setTimeout(() => {
        setDebouncedValue(value);
      }, maxWait);

      return () => {
        clearTimeout(maxWaitTimeout);
      };
    }
  }, [value, maxWait]);

  return debouncedValue;
}

/**
 * Debounce a callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  options?: UseDebounceOptions
): {
  /** The debounced callback function */
  callback: T;
  /** Cancel any pending execution */
  cancel: () => void;
  /** Execute immediately, canceling any pending execution */
  flush: () => void;
  /** Check if there's a pending execution */
  isPending: () => boolean;
} {
  const {
    leading = false,
    trailing = true,
    maxWait,
  } = options || {};

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const maxTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callbackRef = useRef<T>(callback);
  const lastCallTimeRef = useRef<number | undefined>(undefined);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);
  const lastResultRef = useRef<ReturnType<T> | undefined>(undefined);
  const pendingRef = useRef<boolean>(false);

  // Update callback ref when callback changes
  callbackRef.current = callback;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = undefined;
    }
    pendingRef.current = false;
  }, []);

  const flush = useCallback(() => {
    if (pendingRef.current && lastArgsRef.current) {
      cancel();
      lastResultRef.current = callbackRef.current(...lastArgsRef.current);
      return lastResultRef.current;
    }
  }, [cancel]);

  const isPending = useCallback(() => {
    return pendingRef.current;
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      lastArgsRef.current = args;
      lastCallTimeRef.current = now;

      const executeCallback = () => {
        lastResultRef.current = callbackRef.current(...args);
        pendingRef.current = false;
        return lastResultRef.current;
      };

      // Leading edge execution
      if (leading && !pendingRef.current) {
        return executeCallback();
      }

      // Cancel existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      pendingRef.current = true;

      // Set up trailing edge execution
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          executeCallback();
        }, delay);
      }

      // Set up max wait execution
      if (maxWait && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          executeCallback();
        }, maxWait);
      }

      return lastResultRef.current;
    },
    [delay, leading, trailing, maxWait]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return cancel;
  }, [cancel]);

  return {
    callback: debouncedCallback,
    cancel,
    flush,
    isPending,
  };
}

export default useDebounce;