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

import { MENU_STYLES } from '../styles/menu';

import { getAddColumnMenuActions } from '../config';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

interface MenuColumnInsertProps {
  anchorEl: HTMLElement | null;
  menuItems?: { label: string; value: string; icon: any }[];
  onClose: () => void;
  onMenuItemClick: (item: { label: string; value: string }) => void;
}

export const MenuColumnInsert: FC<MenuColumnInsertProps> = ({
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
      placement={MENU_STYLES.popper.placement}
      sx={{ zIndex: MENU_STYLES.popper.zIndex }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={MENU_STYLES.paperSmall}>
          <Stack gap={0}>
            {menuItems_.map((item, index) => {
              if (item.value !== TableColumnMenuActionEnum.divider) {
                return (
                  <MenuItem
                    key={item.value || item.label}
                    onClick={() => onMenuItemClick(item)}
                    sx={[
                      MENU_STYLES.menuItemCompact,
                      { alignItems: 'center', gap: 1 },
                    ]}
                  >
                    {item.icon && (
                      <Icon component={item.icon} sx={MENU_STYLES.icon} />
                    )}
                    {item.label}
                  </MenuItem>
                );
              }
              return (
                <Divider key={item.label + index} sx={MENU_STYLES.divider} />
              );
            })}
          </Stack>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
