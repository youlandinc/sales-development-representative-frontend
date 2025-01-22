import { useEffect } from 'react';

export const useClassNameObserver = (
  element: Element | undefined | null,
  callback: (className: string) => void,
) => {
  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          callback(element.className);
        }
      }
    });

    observer.observe(element, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, [element, callback]);
};
