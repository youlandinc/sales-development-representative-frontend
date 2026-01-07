import { FC } from 'react';
import {
  Box,
  ClickAwayListener,
  Divider,
  MenuItem,
  Paper,
  Popper,
  Stack,
} from '@mui/material';

import { MENU_STYLES } from '../styles/menu';
import { TableIcon } from '../TableIcon';

import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';
import { HeaderState } from '../types';
import { getAiColumnMenuActions, getNormalColumnMenuActions } from '../config';
import { checkIsAiColumn } from '../utils';

interface MenuColumnNormalProps {
  anchorEl: HTMLElement | null;
  columns: any[];
  columnPinning: { left?: string[]; right?: string[] };
  headerState: Pick<HeaderState, 'activeColumnId' | 'isMenuOpen' | 'isEditing'>;
  onClose: () => void;
  onMenuItemClick: (item: {
    label: string;
    value: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
    parentValue?: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
  }) => void;
}

export const MenuColumnNormal: FC<MenuColumnNormalProps> = ({
  anchorEl,
  columns,
  columnPinning,
  headerState,
  onClose,
  onMenuItemClick,
}) => {
  // Use headerState.activeColumnId as the target column for menu operations
  const menuColumnId = headerState.activeColumnId;

  // Don't render menu if no column is active
  if (!menuColumnId) {
    return null;
  }

  return (
    <Popper
      anchorEl={anchorEl}
      open={
        Boolean(anchorEl) && !headerState.isEditing && headerState.isMenuOpen
      }
      placement={MENU_STYLES.popper.placement}
      sx={{ zIndex: MENU_STYLES.popper.zIndex }}
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
        <Paper sx={MENU_STYLES.paperMedium}>
          <Stack gap={0}>
            {(() => {
              const selectedColumn = columns.find(
                (col) => col.fieldId === menuColumnId,
              );
              const isPinned = columnPinning!.left!.includes(menuColumnId);
              const currentColumnType = selectedColumn?.fieldType;

              return selectedColumn && checkIsAiColumn(selectedColumn)
                ? getAiColumnMenuActions(isPinned)
                : getNormalColumnMenuActions(isPinned, currentColumnType);
            })().map((item, index) => {
              if (item.value !== TableColumnMenuActionEnum.divider) {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const selectedColumn = columns.find(
                  (col) => col.fieldId === menuColumnId,
                );
                const currentColumnType = selectedColumn?.fieldType;

                return (
                  <MenuItem
                    component={'div'}
                    key={item.label}
                    onClick={() => !hasSubmenu && onMenuItemClick(item)}
                    sx={{
                      ...MENU_STYLES.menuItemWithSubmenu,
                      color:
                        item.value === TableColumnMenuActionEnum.delete
                          ? '#E26E6E'
                          : 'text.primary',
                    }}
                  >
                    {item.icon}
                    {item.label}
                    {hasSubmenu && (
                      <>
                        <TableIcon.Arrow sx={MENU_STYLES.submenuIcon} />
                        <Paper
                          className="submenu-container"
                          sx={MENU_STYLES.submenuPaper}
                        >
                          <Stack gap={0}>
                            {/* Show title for change column type submenu */}
                            {item.value ===
                              TableColumnMenuActionEnum.change_column_type && (
                              <Box sx={MENU_STYLES.submenuTitle}>
                                Change column type
                              </Box>
                            )}
                            {item.submenu!.map((subItem, subIndex) => {
                              if (
                                subItem.value !==
                                TableColumnMenuActionEnum.divider
                              ) {
                                // Check if this submenu item matches current column type
                                const isCurrentType =
                                  item.value ===
                                    TableColumnMenuActionEnum.change_column_type &&
                                  currentColumnType &&
                                  subItem.value === currentColumnType;

                                return (
                                  <MenuItem
                                    disabled={isCurrentType}
                                    key={subItem.label}
                                    onClick={(e) => {
                                      if (isCurrentType) {
                                        return;
                                      }
                                      e.stopPropagation();
                                      onMenuItemClick({
                                        ...subItem,
                                        parentValue: item.value,
                                      });
                                    }}
                                    sx={[
                                      MENU_STYLES.menuItemWithSubmenu,
                                      isCurrentType && {
                                        opacity: 0.5,
                                        pointerEvents: 'auto',
                                      },
                                    ]}
                                  >
                                    {subItem.icon}
                                    {subItem.label}
                                  </MenuItem>
                                );
                              }
                              return (
                                <Divider
                                  key={subItem.label + subIndex}
                                  sx={MENU_STYLES.divider}
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
                <Divider key={item.label + index} sx={MENU_STYLES.divider} />
              );
            })}
          </Stack>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
