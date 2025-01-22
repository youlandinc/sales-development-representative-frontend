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

    // 开始监听
    observer.observe(element, {
      attributes: true, // 监听属性变化
    });

    // 清理监听器
    return () => observer.disconnect();
  }, [element, callback]);
};
