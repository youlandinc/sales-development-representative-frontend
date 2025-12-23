import { FC, memo, useCallback, useLayoutEffect, useRef } from 'react';
import { InputBase } from '@mui/material';

const CELL_CONSTANTS = {
  FONT_SIZE: 14,
  LINE_HEIGHT: '36px',
} as const;

export interface BodyCellEditorInlineProps {
  value: string;
  onChange: (value: string) => void;
  onStopEdit: () => void;
}

const BodyCellEditorInlineComponent: FC<BodyCellEditorInlineProps> = ({
  value,
  onChange,
  onStopEdit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onStopEdit();
      }
    },
    [onStopEdit],
  );

  return (
    <InputBase
      autoFocus
      inputRef={inputRef}
      onBlur={onStopEdit}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={onKeyDown}
      size="small"
      sx={{
        height: '100%',
        width: '100%',
        fontSize: CELL_CONSTANTS.FONT_SIZE,
        display: 'flex',
        alignItems: 'center',
        lineHeight: CELL_CONSTANTS.LINE_HEIGHT,
        '& input': {
          p: 0,
          m: 0,
          height: '100%',
          boxSizing: 'border-box',
          fontSize: CELL_CONSTANTS.FONT_SIZE,
          lineHeight: CELL_CONSTANTS.LINE_HEIGHT,
        },
      }}
      value={value}
    />
  );
};

export const BodyCellEditorInline = memo(BodyCellEditorInlineComponent);
