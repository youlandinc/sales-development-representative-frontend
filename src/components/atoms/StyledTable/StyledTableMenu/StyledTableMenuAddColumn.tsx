import { FC } from 'react';
import {
  ClickAwayListener,
  Divider,
  Icon,
  MenuItem,
  Paper,
  Popper,
  Stack,
} from '@mui/material';

import {
  createMenuItemStyle,
  createPaperStyle,
  menuStyles,
} from './StyledTableMenu.styles';

import { getAddColumnMenuActions } from '@/constants/table';
import { TableColumnMenuActionEnum } from '@/types/Prospect/table';

interface StyledTableMenuAddColumnProps {
  anchorEl: HTMLElement | null;
  menuItems?: { label: string; value: string; icon: any }[];
  onClose: () => void;
  onMenuItemClick: (item: { label: string; value: string }) => void;
}

export const StyledTableMenuAddColumn: FC<StyledTableMenuAddColumnProps> = ({
  anchorEl,
  menuItems,
  onClose,
  onMenuItemClick,
}) => {
  const menuItems_ = menuItems ?? getAddColumnMenuActions();

  return (
    <Popper
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      placement={menuStyles.popper.placement}
      sx={{ zIndex: menuStyles.popper.zIndex }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={createPaperStyle('small')}>
          <Stack gap={0}>
            {menuItems_.map((item, index) => {
              if (item.value !== TableColumnMenuActionEnum.divider) {
                return (
                  <MenuItem
                    key={item.value || item.label}
                    onClick={() => onMenuItemClick(item)}
                    sx={createMenuItemStyle('compact', {
                      alignItems: 'center',
                      gap: 1,
                    })}
                  >
                    {item.icon && (
                      <Icon component={item.icon} sx={menuStyles.icon} />
                    )}
                    {item.label}
                  </MenuItem>
                );
              }
              return (
                <Divider key={item.label + index} sx={menuStyles.divider} />
              );
            })}
          </Stack>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
