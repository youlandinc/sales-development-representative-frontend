import {
  FC,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Tooltip, TooltipProps } from '@mui/material';

export interface OverflowTooltipProps
  extends Omit<TooltipProps, 'title' | 'children'> {
  children: ReactNode;
  title?: ReactNode;
}

export const OverflowTooltip: FC<OverflowTooltipProps> = ({
  children,
  title,
  ...tooltipProps
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = useCallback(() => {
    const el = textRef.current;
    if (!el) {
      return;
    }
    // Compare scroll width with the parent's client width for table cell context
    const parent = el.parentElement;
    if (parent) {
      const parentStyle = getComputedStyle(parent);
      const paddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(parentStyle.paddingRight) || 0;
      const availableWidth = parent.clientWidth - paddingLeft - paddingRight;
      setIsOverflowing(el.scrollWidth > availableWidth);
    } else {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, []);

  useLayoutEffect(() => {
    checkOverflow();

    const el = textRef.current;
    if (!el) {
      return;
    }

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el.parentElement ?? el);

    return () => resizeObserver.disconnect();
  }, [children, checkOverflow]);

  const content = (
    <span
      ref={textRef}
      style={{
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );

  if (!isOverflowing) {
    return content;
  }

  return (
    <Tooltip arrow placement={'top'} title={title ?? children} {...tooltipProps}>
      {content}
    </Tooltip>
  );
};
