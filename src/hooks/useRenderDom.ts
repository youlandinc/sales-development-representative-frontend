import { MutableRefObject, useCallback } from 'react';

export const useRenderDom = (element: MutableRefObject<HTMLDivElement>) => {
  const renderFile = useCallback(
    (string: string) => {
      if (!element.current?.shadowRoot) {
        element.current.attachShadow({ mode: 'open' });
      }
      element.current.shadowRoot!.innerHTML = `${string || ''}`;
    },
    [element],
  );

  return { renderFile };
};
