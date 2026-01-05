import { useCallback, useMemo, useState } from 'react';
import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { useShallow } from 'zustand/shallow';

import {
  PAPPER_STACK_CONTAINER_SX,
  PAPPER_SX,
  STACK_CONTAINER_SX,
} from '../config';
import { useEnrichmentTableStore } from '@/stores/enrichment';
import {
  TableFilterConditionType,
  TableFilterRequestParams,
} from '@/types/enrichment/tableFilter';

import { FilterFooter } from './FilterFooter';
import { FilterGroup, FilterGroupData, FilterRowData } from './base';
import { PanelIcon } from '../PanelIcon';

const EMPTY_FILTER_ROW: FilterRowData = {
  fieldId: '',
  conditionType: '',
  values: '',
};

const EMPTY_FILTER_GROUP: FilterGroupData = {
  filters: [{ ...EMPTY_FILTER_ROW }],
};

interface PanelFilterProps {
  onFilterChange?: (params: TableFilterRequestParams) => void;
}

export const PanelFilter = ({ onFilterChange }: PanelFilterProps) => {
  const { columns } = useEnrichmentTableStore(
    useShallow((state) => ({
      columns: state.columns,
    })),
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterGroups, setFilterGroups] = useState<FilterGroupData[]>([
    { ...EMPTY_FILTER_GROUP, filters: [{ ...EMPTY_FILTER_ROW }] },
  ]);

  const filterableColumns = useMemo(() => {
    // Show all columns including hidden ones, as long as they have filter conditions
    return columns.filter((col) => col.supportedFilterConditions?.length);
  }, [columns]);

  const filledFilterCount = useMemo(() => {
    return filterGroups.reduce((count, group) => {
      return (
        count + group.filters.filter((f) => f.fieldId && f.conditionType).length
      );
    }, 0);
  }, [filterGroups]);

  const buildRequestParams = useCallback((): TableFilterRequestParams => {
    return filterGroups
      .map((group) => ({
        filters: group.filters
          .filter((f) => f.fieldId && f.conditionType)
          .map((f) => ({
            fieldId: f.fieldId,
            conditionType: f.conditionType as TableFilterConditionType,
            values: f.values,
          })),
      }))
      .filter((group) => group.filters.length > 0);
  }, [filterGroups]);

  const onFilterRowChange = useCallback(
    (
      groupIndex: number,
      rowIndex: number,
      field: keyof FilterRowData,
      value: FilterRowData[keyof FilterRowData],
    ) => {
      setFilterGroups((prev) => {
        const newGroups = [...prev];
        newGroups[groupIndex] = {
          ...newGroups[groupIndex],
          filters: newGroups[groupIndex].filters.map((filter, i) =>
            i === rowIndex ? { ...filter, [field]: value } : filter,
          ),
        };
        return newGroups;
      });

      setTimeout(() => {
        const params = buildRequestParams();
        onFilterChange?.(params);
      }, 0);
    },
    [buildRequestParams, onFilterChange],
  );

  const onAddFilterRow = useCallback((groupIndex: number) => {
    setFilterGroups((prev) => {
      const newGroups = [...prev];
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        filters: [...newGroups[groupIndex].filters, { ...EMPTY_FILTER_ROW }],
      };
      return newGroups;
    });
  }, []);

  const onDeleteFilterRow = useCallback(
    (groupIndex: number, rowIndex: number) => {
      setFilterGroups((prev) => {
        const newGroups = [...prev];
        const newFilters = newGroups[groupIndex].filters.filter(
          (_, i) => i !== rowIndex,
        );

        if (newFilters.length === 0) {
          return prev.filter((_, i) => i !== groupIndex);
        }

        newGroups[groupIndex] = {
          ...newGroups[groupIndex],
          filters: newFilters,
        };
        return newGroups;
      });

      setTimeout(() => {
        const params = buildRequestParams();
        onFilterChange?.(params);
      }, 0);
    },
    [buildRequestParams, onFilterChange],
  );

  const onDuplicateFilterRow = useCallback(
    (groupIndex: number, rowIndex: number) => {
      setFilterGroups((prev) => {
        const newGroups = [...prev];
        const filterToDuplicate = newGroups[groupIndex].filters[rowIndex];
        newGroups[groupIndex] = {
          ...newGroups[groupIndex],
          filters: [
            ...newGroups[groupIndex].filters.slice(0, rowIndex + 1),
            { ...filterToDuplicate },
            ...newGroups[groupIndex].filters.slice(rowIndex + 1),
          ],
        };
        return newGroups;
      });
    },
    [],
  );

  const onAddFilterGroup = useCallback(() => {
    setFilterGroups((prev) => [
      ...prev,
      { filters: [{ ...EMPTY_FILTER_ROW }] },
    ]);
  }, []);

  const onClearAllFilters = useCallback(() => {
    setFilterGroups([{ filters: [{ ...EMPTY_FILTER_ROW }] }]);
    onFilterChange?.([]);
  }, [onFilterChange]);

  return (
    <>
      <Stack
        onMouseDown={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
        sx={STACK_CONTAINER_SX}
      >
        <PanelIcon.FilterIcon />
        <Typography sx={{ fontSize: 14, lineHeight: 1.4 }}>
          {filledFilterCount > 0
            ? `${filledFilterCount} filters`
            : 'No filters'}
        </Typography>
      </Stack>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement={'bottom'}
        sx={{ zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Paper sx={{ ...PAPPER_SX }}>
              <ClickAwayListener
                mouseEvent={'onMouseDown'}
                onClickAway={() => setAnchorEl(null)}
                touchEvent={'onTouchStart'}
              >
                <Stack
                  sx={{
                    ...PAPPER_STACK_CONTAINER_SX,
                    width: 'min(100vw,760px)',
                    px: 3,
                    py: 1.5,
                    gap: 1.5,
                  }}
                >
                  {filterGroups.map((group, groupIndex) => (
                    <FilterGroup
                      columns={filterableColumns}
                      data={group}
                      groupIndex={groupIndex}
                      key={groupIndex}
                      onAddFilterRow={onAddFilterRow}
                      onDeleteFilterRow={onDeleteFilterRow}
                      onDuplicateFilterRow={onDuplicateFilterRow}
                      onFilterRowChange={onFilterRowChange}
                    />
                  ))}

                  <FilterFooter
                    disabled={filledFilterCount === 0}
                    onClickToAddGroup={async () => onAddFilterGroup()}
                    onClickToClearAll={async () => onClearAllFilters()}
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
