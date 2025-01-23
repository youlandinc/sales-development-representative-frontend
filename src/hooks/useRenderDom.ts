import { RefObject, useCallback } from 'react';

export const useRenderDom = (
  element: RefObject<HTMLDivElement>,
  style?: string,
) => {
  const renderFile = useCallback(
    (string: string) => {
      if (!element.current?.shadowRoot) {
        element.current.attachShadow({ mode: 'open' });
      }
      element.current.shadowRoot!.innerHTML = `<style>${style ?? ''} </style>${string || ''}`;
    },
    [element],
  );

  return { renderFile };
};
