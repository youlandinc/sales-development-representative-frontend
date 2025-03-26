import { DependencyList, useEffect } from 'react';
import { useAsyncFn } from './useAsyncFn';

type FunctionReturningPromise = (...args: any[]) => Promise<any>;

export const useAsync = <T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
) => {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
};
