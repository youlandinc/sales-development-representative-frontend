import { FC, useCallback, useMemo, useState } from 'react';
import {
  ClickAwayListener,
  Divider,
  Grow,
  Icon,
  InputAdornment,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useShallow } from 'zustand/react/shallow';

import { buildColumnSortParams } from '../../Table/utils/handler';
import { useMergedColumns } from '../../hooks';

import {
  PAPPER_STACK_CONTAINER_SX,
  PAPPER_SX,
  STACK_CONTAINER_SX,
} from '../config';
import { PanelIcon } from '../PanelIcon';
import { TableIcon } from '../../Table';

import { useEnrichmentTableStore } from '@/stores/enrichment';
import { TableColumnProps } from '@/types/enrichment/table';

import { StyledTextField } from '@/components/atoms';
import { ColumnSection } from './index';

interface PanelColumnsProps {
  tableId: string;
}

export const PanelColumns: FC<PanelColumnsProps> = ({ tableId }) => {
  const {
    updateViewColumnVisible,
    updateViewColumnsVisible,
    updateColumnOrder,
    setActiveColumnId,
  } = useEnrichmentTableStore(
    useShallow((store) => ({
      updateViewColumnVisible: store.updateViewColumnVisible,
      updateViewColumnsVisible: store.updateViewColumnsVisible,
      updateColumnOrder: store.updateColumnOrder,
      setActiveColumnId: store.setActiveColumnId,
    })),
  );

  // Get merged columns
  const columns = useMergedColumns();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const columnsVisible = useMemo(() => {
    return columns.filter((col: TableColumnProps) => col.visible).length;
  }, [columns]);

  const { pinnedColumns, unpinnedColumns } = useMemo(() => {
    const lowerSearch = searchValue.toLowerCase().trim();
    const filtered = lowerSearch
      ? columns.filter((col: TableColumnProps) =>
          col.fieldName.toLowerCase().includes(lowerSearch),
        )
      : columns;

    return {
      pinnedColumns: filtered.filter((col: TableColumnProps) => col.pin),
      unpinnedColumns: filtered.filter((col: TableColumnProps) => !col.pin),
    };
  }, [columns, searchValue]);

  const pinnedColumnIds = useMemo(
    () => pinnedColumns.map((col: TableColumnProps) => col.fieldId),
    [pinnedColumns],
  );

  const unpinnedColumnIds = useMemo(
    () => unpinnedColumns.map((col: TableColumnProps) => col.fieldId),
    [unpinnedColumns],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const isSearching = searchValue.trim().length > 0;

  const onColumnSortEnd = useCallback(
    async (event: DragEndEvent) => {
      const params = buildColumnSortParams(event);
      if (!params) {
        return;
      }
      await updateColumnOrder({ tableId, ...params });
    },
    [tableId, updateColumnOrder],
  );

  const onPanelClose = useCallback(() => {
    setAnchorEl(null);
    setActiveColumnId('');
  }, [setActiveColumnId]);

  const onColumnNameClick = useCallback(
    (fieldId: string) => {
      setActiveColumnId(fieldId);
    },
    [setActiveColumnId],
  );

  const onVisibilityToggle = useCallback(
    async (fieldId: string, visible: boolean) => {
      await updateViewColumnVisible(fieldId, visible);
    },
    [updateViewColumnVisible],
  );

  const onColumnsShowAll = useCallback(async () => {
    const updates = columns
      .filter((col: TableColumnProps) => !col.visible)
      .map((col: TableColumnProps) => ({
        fieldId: col.fieldId,
        visible: true,
      }));
    if (updates.length) {
      await updateViewColumnsVisible(updates);
    }
  }, [columns, updateViewColumnsVisible]);

  const onColumnsHideAll = useCallback(async () => {
    const updates = columns
      .filter((col: TableColumnProps) => col.visible)
      .map((col: TableColumnProps) => ({
        fieldId: col.fieldId,
        visible: false,
      }));
    if (updates.length) {
      await updateViewColumnsVisible(updates);
    }
  }, [columns, updateViewColumnsVisible]);

  return (
    <>
      <Stack
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
        sx={STACK_CONTAINER_SX}
      >
        <PanelIcon.ColumnsIcon />
        <Typography sx={{ fontSize: 14, lineHeight: 1.4 }}>
          {columnsVisible}/{columns.length} columns
        </Typography>
      </Stack>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement="bottom"
        sx={{ zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Paper sx={PAPPER_SX}>
              <ClickAwayListener
                mouseEvent={'onMouseDown'}
                onClickAway={() => onPanelClose()}
                touchEvent={'onTouchStart'}
              >
                <Stack
                  sx={{
                    ...PAPPER_STACK_CONTAINER_SX,
                    gap: 0.5,
                    overflow: 'auto',
                  }}
                >
                  <Stack sx={{ px: 1.5, pt: 1.5 }}>
                    <StyledTextField
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={'Search'}
                      size={'small'}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PanelIcon.ColumnsSearch
                                sx={{
                                  '& path': { fill: '#6F6C7D' },
                                }}
                              />
                            </InputAdornment>
                          ),
                        },
                        htmlInput: {
                          autoComplete: 'new-password',
                          'aria-autocomplete': 'none',
                          'data-form-type': 'other',
                          'data-lpignore': 'true',
                        },
                      }}
                      value={searchValue}
                    />
                  </Stack>

                  <Stack
                    onClick={onColumnsShowAll}
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      height: 32,
                      gap: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#F4F5F9',
                      },
                    }}
                  >
                    <Icon
                      component={TableIcon.MenuVisibleRaw}
                      sx={{
                        width: 16,
                        height: 16,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 14,
                      }}
                    >
                      Show all columns
                    </Typography>
                  </Stack>

                  <Stack
                    onClick={onColumnsHideAll}
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      height: 32,
                      gap: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#F4F5F9',
                      },
                    }}
                  >
                    <Icon
                      component={TableIcon.MenuHideRaw}
                      sx={{
                        width: 16,
                        height: 16,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 14,
                      }}
                    >
                      Hide all columns
                    </Typography>
                  </Stack>

                  <Divider sx={{ borderColor: '#DFDEE6' }} />

                  <ColumnSection
                    columnIds={pinnedColumnIds}
                    columns={pinnedColumns}
                    isSearching={isSearching}
                    onColumnNameClick={onColumnNameClick}
                    onDragEnd={onColumnSortEnd}
                    onVisibilityToggle={onVisibilityToggle}
                    sensors={sensors}
                  />

                  {pinnedColumns.length > 0 && unpinnedColumns.length > 0 && (
                    <Divider sx={{ borderColor: '#DFDEE6' }} />
                  )}

                  <ColumnSection
                    columnIds={unpinnedColumnIds}
                    columns={unpinnedColumns}
                    isSearching={isSearching}
                    onColumnNameClick={onColumnNameClick}
                    onDragEnd={onColumnSortEnd}
                    onVisibilityToggle={onVisibilityToggle}
                    sensors={sensors}
                  />
                </Stack>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
