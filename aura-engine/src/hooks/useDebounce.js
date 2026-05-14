import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 *
 * Delays updating the debounced value until after `delay` milliseconds
 * have elapsed since the last time `value` changed.
 *
 * Used for the omnisearch bar to prevent API calls on every keystroke.
 * Default delay: 500ms (per client requirement).
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
