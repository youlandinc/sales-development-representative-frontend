import { useEffect, useRef } from 'react';

export const useFormatString = (str: string) => {
  const ref = useRef('');
  useEffect(() => {
    ref.current = str;
  });
  return ref.current;
};
