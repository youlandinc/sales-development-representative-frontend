import { useEffect, useRef } from 'react';

export const StyledShadowContent = ({ html }: { html: string }) => {
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shadowRef.current) {
      return;
    }

    const shadowRoot =
      shadowRef.current.shadowRoot ||
      shadowRef.current.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = '';

    let cleanHtml = html.replace(/```html\s*\n?/, '').replace(/```\s*$/, '');

    cleanHtml = cleanHtml.trim();

    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = cleanHtml;

    shadowRoot.appendChild(contentContainer);
  }, [html]);

  return <div ref={shadowRef} />;
};
