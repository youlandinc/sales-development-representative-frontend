import { ChangeEvent, FC, KeyboardEvent, useLayoutEffect, useRef } from 'react';
import { ClickAwayListener, InputBase, Paper, Popper } from '@mui/material';
import { TABLE_COLORS } from '@/components/atoms/StyledTable/styles';

const CELL_EDITOR_CONSTANTS = {
  FONT_SIZE: 14,
  LINE_HEIGHT: 1.5,
  Z_INDEX: 1300,
} as const;

interface StyledTableMenuCellEditorProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  value: string;
  width: number;
  onChange: (value: string) => void;
  onSave: () => void; // Save current value and close
  onCancel: () => void; // Discard changes and close
}

export const StyledTableMenuCellEditor: FC<StyledTableMenuCellEditorProps> = ({
  anchorEl,
  isOpen,
  value,
  width,
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
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, -(anchorEl?.offsetHeight ?? 0)],
          },
        },
      ]}
      open={isOpen}
      placement="bottom-start"
      sx={{ zIndex: CELL_EDITOR_CONSTANTS.Z_INDEX }}
    >
      <ClickAwayListener onClickAway={onSave}>
        <Paper
          elevation={4}
          sx={{
            px: 1.5,
            width: width + 48,
            border: `2px solid ${TABLE_COLORS.SELECTION_BORDER}`,
            outline: `2px solid ${TABLE_COLORS.SELECTION_OUTLINE}`,
            borderRadius: 0,
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
              py: 1,
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
