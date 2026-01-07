import { FC } from 'react';
import {
  ClickAwayListener,
  MenuItem,
  Paper,
  Popper,
  Stack,
} from '@mui/material';

import { MENU_STYLES } from '../styles/menu';
import { AiRunParams } from '../types';

interface MenuColumnAiProps {
  anchorEl: HTMLElement | null;
  columnId: string;
  rowIds: string[];
  onClose: () => void;
  onRunAi?: (params: AiRunParams) => Promise<void>;
}

export const MenuColumnAi: FC<MenuColumnAiProps> = ({
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
      placement={MENU_STYLES.popper.placement}
      sx={{ zIndex: MENU_STYLES.popper.zIndex }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={MENU_STYLES.paperLarge}>
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
                  sx={MENU_STYLES.menuItemComfortable}
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
                  sx={MENU_STYLES.menuItemComfortable}
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
                sx={MENU_STYLES.menuItemComfortable}
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
