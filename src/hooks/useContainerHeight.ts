import { RefObject, useEffect, useState } from 'react';

export const useContainerHeight = (ref: RefObject<HTMLElement | null>) => {
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setContainerHeight(rect.height);
    }
  }, [ref]);

  return containerHeight;
};
