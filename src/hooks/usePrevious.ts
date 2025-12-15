import { useEffect, useRef } from 'react';

/**
 * Returns the previous value of the given input.
 * Useful for comparing current vs previous values to detect changes.
 */
export const usePrevious = <T = string>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
