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

import { createPaperStyle, menuStyles } from './StyledTableMenu.styles';

import ICON_ARROW from '../assets/icon-arrow.svg';

import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/Prospect/table';
import {
  getAiColumnMenuActions,
  getNormalColumnMenuActions,
} from '@/constant/table';
import { isAiColumn } from '@/components/molecules';

interface StyledTableMenuHeaderProps {
  anchorEl: HTMLElement | null;
  columns: any[];
  selectedColumnId: string;
  columnPinning: { left?: string[]; right?: string[] };
  headerState: {
    columnId: string;
    isActive?: boolean;
    isEditing?: boolean;
    isShowMenu?: boolean;
  } | null;
  onClose: () => void;
  onMenuItemClick: (item: {
    label: string;
    value: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
    parentValue?: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
  }) => void;
}

export const StyledTableMenuHeader: FC<StyledTableMenuHeaderProps> = ({
  anchorEl,
  columns,
  selectedColumnId,
  columnPinning,
  headerState,
  onClose,
  onMenuItemClick,
}) => {
  return (
    <Popper
      anchorEl={anchorEl}
      open={
        Boolean(anchorEl) && !headerState?.isEditing && !!headerState?.isActive
      }
      placement={menuStyles.popper.placement}
      sx={{ zIndex: menuStyles.popper.zIndex }}
    >
      <ClickAwayListener
        onClickAway={(event) => {
          const target = event.target as HTMLElement;
          const isHeaderClick = target.closest('[data-table-header]') !== null;

          if (!isHeaderClick) {
            onClose();
          }
        }}
      >
        <Paper sx={createPaperStyle('medium')}>
          <Stack gap={0}>
            {(() => {
              const selectedColumn = columns.find(
                (col) => col.fieldId === selectedColumnId,
              );
              const isPinned = columnPinning!.left!.includes(selectedColumnId);

              return selectedColumn && isAiColumn(selectedColumn)
                ? getAiColumnMenuActions(isPinned)
                : getNormalColumnMenuActions(isPinned);
            })().map((item, index) => {
              if (item.value !== TableColumnMenuActionEnum.divider) {
                const hasSubmenu = item.submenu && item.submenu.length > 0;

                return (
                  <MenuItem
                    component={'div'}
                    key={item.label}
                    onClick={() => !hasSubmenu && onMenuItemClick(item)}
                    sx={menuStyles.menuItemWithSubmenu}
                  >
                    {item.icon && (
                      <Icon component={item.icon} sx={menuStyles.icon} />
                    )}
                    {item.label}
                    {hasSubmenu && (
                      <>
                        <Icon
                          component={ICON_ARROW}
                          sx={menuStyles.submenuIcon}
                        />
                        <Paper
                          className="submenu-container"
                          sx={menuStyles.submenuPaper}
                        >
                          <Stack gap={0}>
                            {item.submenu!.map((subItem, subIndex) => {
                              if (
                                subItem.value !==
                                TableColumnMenuActionEnum.divider
                              ) {
                                return (
                                  <MenuItem
                                    component={'div'}
                                    key={subItem.label}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Pass both parent menu item and sub item
                                      onMenuItemClick({
                                        ...subItem,
                                        parentValue: item.value,
                                      });
                                    }}
                                    sx={menuStyles.menuItemWithSubmenu}
                                  >
                                    {subItem.icon && (
                                      <Icon
                                        component={subItem.icon}
                                        sx={menuStyles.icon}
                                      />
                                    )}
                                    {subItem.label}
                                  </MenuItem>
                                );
                              }
                              return (
                                <Divider
                                  key={subItem.label + subIndex}
                                  sx={menuStyles.divider}
                                />
                              );
                            })}
                          </Stack>
                        </Paper>
                      </>
                    )}
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
