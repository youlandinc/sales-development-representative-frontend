import { FC, KeyboardEvent, RefObject } from 'react';
import { InputBase } from '@mui/material';

interface HeadCellEditorProps {
  value: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onValueChange: (value: string) => void;
  onSave: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

export const HeadCellEditor: FC<HeadCellEditorProps> = ({
  value,
  inputRef,
  onValueChange,
  onSave,
  onKeyDown,
}) => {
  return (
    <InputBase
      inputProps={{
        ref: inputRef,
      }}
      onBlur={onSave}
      onChange={(e) => onValueChange(e.target.value)}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      sx={{
        fontSize: 14,
        fontWeight: 500,
        color: 'text.primary',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        '& input': {
          padding: 0,
          textAlign: 'left',
          height: '100%',
        },
      }}
      value={value}
    />
  );
};
