import { useCallback, useRef } from 'react';

/**
 * useThrottle - 创建一个节流函数，限制回调在指定时间内只执行一次
 * @param callback 需要节流的函数
 * @param delay 节流时间间隔（ms）
 * @returns 节流后的函数
 */
export function useThrottleFn<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const lastExecTime = useRef(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      const now = Date.now();
      const timeSinceLastExec = now - lastExecTime.current;
      const timeRemaining = delay - timeSinceLastExec;

      if (timeRemaining <= 0) {
        lastExecTime.current = now;
        callback(...args);
      } else {
        timeoutId.current = setTimeout(() => {
          lastExecTime.current = Date.now();
          callback(...args);
        }, timeRemaining);
      }
    },
    [callback, delay],
  );

  return throttledCallback as T;
}
