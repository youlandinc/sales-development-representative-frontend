import {
  ClickAwayListener,
  MenuItem,
  Paper,
  Popper,
  Stack,
} from '@mui/material';
import { FC } from 'react';

import { createMenuItemStyle, createPaperStyle, menuStyles } from './StyledTableMenu.styles';

interface StyledTableMenuAiRunProps {
  anchorEl: HTMLElement | null;
  columnId: string;
  rowIds: string[];
  onClose: () => void;
  onRunAi?: (params: {
    fieldId: string;
    recordId?: string;
    isHeader?: boolean;
    recordCount?: number;
  }) => Promise<void>;
}

export const StyledTableMenuAiRun: FC<StyledTableMenuAiRunProps> = ({
  anchorEl,
  columnId,
  rowIds,
  onClose,
  onRunAi,
}) => {
  return (
    <Popper
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      placement={menuStyles.popper.placement}
      sx={{ zIndex: menuStyles.popper.zIndex }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={createPaperStyle('large')}>
          <Stack gap={0}>
            {rowIds.length > 10 ? (
              <>
                <MenuItem
                  onClick={() => {
                    onRunAi?.({
                      fieldId: columnId,
                      isHeader: true,
                      recordCount: 10,
                    });
                    onClose();
                  }}
                  sx={createMenuItemStyle('comfortable')}
                >
                  Run first 10 rows
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onRunAi?.({
                      fieldId: columnId,
                      isHeader: true,
                    });
                    onClose();
                  }}
                  sx={createMenuItemStyle('comfortable')}
                >
                  Run all rows that haven&#39;t run or have errors
                </MenuItem>
              </>
            ) : (
              <MenuItem
                onClick={() => {
                  onRunAi?.({
                    fieldId: columnId,
                    isHeader: true,
                    recordCount: rowIds.length,
                  });
                  onClose();
                }}
                sx={createMenuItemStyle('comfortable')}
              >
                Run {rowIds.length} {rowIds.length === 1 ? 'row' : 'rows'}
              </MenuItem>
            )}
          </Stack>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
