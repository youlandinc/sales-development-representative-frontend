import { ChangeEvent, FC, KeyboardEvent, useLayoutEffect, useRef } from 'react';
import { ClickAwayListener, InputBase, Paper, Popper } from '@mui/material';

const CELL_EDITOR_CONSTANTS = {
  FONT_SIZE: 14,
  LINE_HEIGHT: 1.5,
  Z_INDEX: 1300,
  MAX_WIDTH: 400,
} as const;

interface StyledTableMenuCellEditorProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  value: string;
  minWidth: number;
  onChange: (value: string) => void;
  onSave: () => void; // Save current value and close
  onCancel: () => void; // Discard changes and close
}

export const StyledTableMenuCellEditor: FC<StyledTableMenuCellEditorProps> = ({
  anchorEl,
  isOpen,
  value,
  minWidth,
  onChange,
  onSave,
  onCancel,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Escape: cancel and close (discard changes)
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
      return;
    }
    // Enter (without Shift): save and close
    // Shift+Enter: allow new line (default multiline behavior)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave();
    }
  };

  if (!isOpen || !anchorEl) {
    return null;
  }

  return (
    <Popper
      anchorEl={anchorEl}
      open={isOpen}
      placement="bottom-start"
      sx={{ zIndex: CELL_EDITOR_CONSTANTS.Z_INDEX }}
    >
      <ClickAwayListener onClickAway={onSave}>
        <Paper
          elevation={4}
          sx={{
            minWidth,
            maxWidth: CELL_EDITOR_CONSTANTS.MAX_WIDTH,
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: '4px',
          }}
        >
          <InputBase
            autoFocus
            inputRef={inputRef}
            multiline
            onChange={onInputChange}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            size="small"
            sx={{
              width: '100%',
              fontSize: CELL_EDITOR_CONSTANTS.FONT_SIZE,
              p: 1,
              '& textarea': {
                p: 0,
                m: 0,
                fontSize: CELL_EDITOR_CONSTANTS.FONT_SIZE,
                lineHeight: CELL_EDITOR_CONSTANTS.LINE_HEIGHT,
              },
            }}
            value={value}
          />
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
