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
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useShallow } from 'zustand/react/shallow';

import { COLUMN_TYPE_ICONS } from '../Table/config';
import {
  PAPPER_CONFIG,
  PAPPER_STACK_CONTAINER_SX,
  STACK_CONTAINER_SX,
} from './config';

import { useEnrichmentTableStore } from '@/stores/enrichment';
import { TableColumnProps } from '@/types/enrichment';

import { StyledTextField } from '@/components/atoms';

import ICON_SEARCH from '../assets/head/icon-search.svg';
import ICON_COLUMN from '../assets/head/icon-column.svg';
import ICON_COLUMN_HIDE from '../assets/table/icon-column-hide.svg';
import ICON_COLUMN_VISIBLE from '../assets/table/icon-column-visible.svg';

interface SortableColumnItemProps {
  column: TableColumnProps;
  onColumnNameClick: (fieldId: string) => void;
  onVisibilityToggle: (fieldId: string, visible: boolean) => void;
}

const SortableColumnItem: FC<SortableColumnItemProps> = ({
  column,
  onColumnNameClick,
  onVisibilityToggle,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.fieldId,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Stack
      ref={setNodeRef}
      style={style}
      sx={{
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 1,
        height: 32,
        alignItems: 'center',
        flexDirection: 'row',
        cursor: 'grab',
        bgcolor: isDragging ? '#F4F5F9' : 'transparent',
        '&:hover': {
          bgcolor: '#F4F5F9',
          '& .action': {
            display: 'block',
          },
        },
      }}
      {...attributes}
      {...listeners}
    >
      <Icon
        component={COLUMN_TYPE_ICONS[column.fieldType]}
        sx={{
          width: 16,
          height: 16,
          flexShrink: 0,
          '& path': {
            fill: !column.visible ? '#B0ADBD' : '#2A292E',
          },
        }}
      />
      <Typography
        onClick={() => onColumnNameClick(column.fieldId)}
        sx={{
          fontSize: 14,
          color: column.visible ? 'text.primary' : '#B0ADBD',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
            textDecorationColor: 'rgba(111, 108, 125, .5)',
            textUnderlineOffset: '2px',
          },
        }}
      >
        {column.fieldName}
      </Typography>
      <Icon
        className="action"
        component={column.visible ? ICON_COLUMN_VISIBLE : ICON_COLUMN_HIDE}
        onClick={() => onVisibilityToggle(column.fieldId, !column.visible)}
        sx={{
          ml: 'auto',
          width: 12,
          height: 12,
          flexShrink: 0,
          display: !column.visible ? 'block' : 'none',
          cursor: 'pointer',
          '& path': {
            fill: !column.visible ? '#B0ADBD' : '#2A292E',
          },
        }}
      />
    </Stack>
  );
};

interface SortableColumnSectionProps {
  columns: TableColumnProps[];
  columnIds: string[];
  isSearching: boolean;
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  onColumnNameClick: (fieldId: string) => void;
  onVisibilityToggle: (fieldId: string, visible: boolean) => void;
}

const SortableColumnSection: FC<SortableColumnSectionProps> = ({
  columns,
  columnIds,
  isSearching,
  sensors,
  onDragEnd,
  onColumnNameClick,
  onVisibilityToggle,
}) => {
  if (columns.length === 0) {
    return null;
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <SortableContext
        disabled={isSearching}
        items={columnIds}
        strategy={verticalListSortingStrategy}
      >
        {columns.map((col) => (
          <SortableColumnItem
            column={col}
            key={col.fieldId}
            onColumnNameClick={onColumnNameClick}
            onVisibilityToggle={onVisibilityToggle}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

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
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = columns.findIndex((col) => col.fieldId === active.id);
      const newIndex = columns.findIndex((col) => col.fieldId === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const currentFieldId = active.id as string;
      const newColumns = arrayMove(columns, oldIndex, newIndex);
      const targetIndex = newColumns.findIndex(
        (col) => col.fieldId === currentFieldId,
      );

      const beforeFieldId = newColumns[targetIndex + 1]?.fieldId;
      const afterFieldId = newColumns[targetIndex - 1]?.fieldId;

      await updateColumnOrder({
        tableId,
        currentFieldId,
        beforeFieldId,
        afterFieldId,
      });
    },
    [columns, tableId, updateColumnOrder],
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
        <Typography fontSize={14} lineHeight={1.4}>
          {columnsVisible}/{columns.length} columns
        </Typography>
      </Stack>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Paper {...PAPPER_CONFIG}>
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
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 1,
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
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 1,
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
