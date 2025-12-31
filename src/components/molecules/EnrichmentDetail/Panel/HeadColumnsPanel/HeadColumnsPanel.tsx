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
import {
  PAPPER_STACK_CONTAINER_SX,
  PAPPER_SX,
  STACK_CONTAINER_SX,
} from '../config';
import { SortableColumnSection } from './index';

import { useEnrichmentTableStore } from '@/stores/enrichment';

import { StyledTextField } from '@/components/atoms';

import ICON_SEARCH from './assets/icon-search.svg';
import ICON_COLUMN from './assets/icon-column.svg';
import ICON_COLUMN_HIDE from '../../assets/table/icon-column-hide.svg';
import ICON_COLUMN_VISIBLE from '../../assets/table/icon-column-visible.svg';

interface HeadColumnsPanelProps {
  tableId: string;
}

export const HeadColumnsPanel: FC<HeadColumnsPanelProps> = ({ tableId }) => {
  const {
    columns,
    updateColumnVisible,
    updateColumnsVisible,
    updateColumnOrder,
    setActiveColumnId,
  } = useEnrichmentTableStore(
    useShallow((store) => ({
      columns: store.columns,
      updateColumnVisible: store.updateColumnVisible,
      updateColumnsVisible: store.updateColumnsVisible,
      updateColumnOrder: store.updateColumnOrder,
      setActiveColumnId: store.setActiveColumnId,
    })),
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const columnsVisible = useMemo(() => {
    return columns.filter((col) => col.visible).length;
  }, [columns]);

  const { pinnedColumns, unpinnedColumns } = useMemo(() => {
    const lowerSearch = searchValue.toLowerCase().trim();
    const filtered = lowerSearch
      ? columns.filter((col) =>
          col.fieldName.toLowerCase().includes(lowerSearch),
        )
      : columns;

    return {
      pinnedColumns: filtered.filter((col) => col.pin),
      unpinnedColumns: filtered.filter((col) => !col.pin),
    };
  }, [columns, searchValue]);

  const pinnedColumnIds = useMemo(
    () => pinnedColumns.map((col) => col.fieldId),
    [pinnedColumns],
  );

  const unpinnedColumnIds = useMemo(
    () => unpinnedColumns.map((col) => col.fieldId),
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
      await updateColumnVisible(fieldId, visible);
    },
    [updateColumnVisible],
  );

  const onColumnsShowAll = useCallback(async () => {
    const updates = columns
      .filter((col) => !col.visible)
      .map((col) => ({ fieldId: col.fieldId, visible: true }));
    if (updates.length) {
      await updateColumnsVisible(updates);
    }
  }, [columns, updateColumnsVisible]);

  const onColumnsHideAll = useCallback(async () => {
    const updates = columns
      .filter((col) => col.visible)
      .map((col) => ({ fieldId: col.fieldId, visible: false }));
    if (updates.length) {
      await updateColumnsVisible(updates);
    }
  }, [columns, updateColumnsVisible]);

  return (
    <>
      <Stack
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={STACK_CONTAINER_SX}
      >
        <Icon component={ICON_COLUMN} sx={{ width: 20, height: 20 }} />
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
              <ClickAwayListener onClickAway={onPanelClose}>
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
                              <Icon
                                component={ICON_SEARCH}
                                sx={{
                                  width: 16,
                                  height: 16,
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
                      component={ICON_COLUMN_VISIBLE}
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
                      component={ICON_COLUMN_HIDE}
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

                  <SortableColumnSection
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

                  <SortableColumnSection
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
