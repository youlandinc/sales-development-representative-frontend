import { FC, useMemo, useState } from 'react';
import {
  Box,
  ClickAwayListener,
  Icon,
  IconButton,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';

import { TableColumnProps } from '@/types/enrichment/table';

import { getColumnTypeIcon } from '../utils';
import { CONDITION_LABEL_MAP } from '../config/valueToContent';
import { FilterRowData, FilterSelect, FilterValueInput } from './index';

import ICON_DOTS from '../asset/icon-dots.svg';
import ICON_COPY from '../asset/icon-copy.svg';
import ICON_TRASH from '../asset/icon-trash.svg';

interface FilterRowProps {
  groupIndex: number;
  rowIndex: number;
  isFirst: boolean;
  data: FilterRowData;
  columns: TableColumnProps[];
  onFieldChange: (
    field: keyof FilterRowData,
    value: FilterRowData[keyof FilterRowData],
  ) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const FilterRow: FC<FilterRowProps> = ({
  isFirst,
  data,
  columns,
  onFieldChange,
  onDelete,
  onDuplicate,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const selectedColumn = useMemo(() => {
    return columns.find((col) => col.fieldId === data.fieldId);
  }, [columns, data.fieldId]);

  const columnOptions = useMemo(() => {
    return columns
      .filter((col) => col.supportedFilterConditions?.length)
      .map((col) => ({
        label: col.fieldName,
        value: col.fieldId,
        key: col.fieldId,
        icon: getColumnTypeIcon(col.fieldType),
      }));
  }, [columns]);

  const conditionOptions = useMemo(() => {
    if (!selectedColumn?.supportedFilterConditions) {
      return [];
    }
    return selectedColumn.supportedFilterConditions.map((op) => ({
      label: CONDITION_LABEL_MAP[op.conditionType] || op.conditionType,
      value: op.conditionType,
      key: op.conditionType,
    }));
  }, [selectedColumn]);

  const selectedOperator = useMemo(() => {
    return selectedColumn?.supportedFilterConditions?.find(
      (op) => op.conditionType === data.conditionType,
    );
  }, [selectedColumn, data.conditionType]);

  const isNeedValue = selectedOperator?.needsValue ?? true;

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography
        sx={{
          width: 52,
          textAlign: 'right',
          color: 'text.secondary',
          fontSize: 14,
        }}
      >
        {isFirst ? 'Where' : 'and'}
      </Typography>

      <Stack
        sx={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          <FilterSelect
            onChange={(val) => {
              onFieldChange('fieldId', val);
              onFieldChange('conditionType', '');
              onFieldChange('values', '');
            }}
            options={columnOptions}
            placeholder="Column"
            size="small"
            sx={{ minWidth: 160 }}
            value={data.fieldId}
          />

          <FilterSelect
            disabled={!data.fieldId}
            onChange={(val) => {
              onFieldChange('conditionType', val);
            }}
            options={conditionOptions}
            placeholder="Condition"
            showIcon={false}
            size="small"
            sx={{ width: 180 }}
            value={data.conditionType}
          />

          {isNeedValue && (
            <FilterValueInput
              column={selectedColumn}
              conditionType={data.conditionType}
              onChange={(value: string | string[]) =>
                onFieldChange('values', value)
              }
              value={data.values}
            />
          )}
        </Stack>

        <Box>
          <IconButton
            onClick={(e) => setMenuAnchor(menuAnchor ? null : e.currentTarget)}
            size="small"
            sx={{ p: 0.25 }}
          >
            <Icon component={ICON_DOTS} sx={{ width: 20, height: 20 }} />
          </IconButton>

          <Popper
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            placement="bottom-end"
            sx={{ zIndex: 1400 }}
          >
            <ClickAwayListener onClickAway={() => setMenuAnchor(null)}>
              <Paper
                sx={{
                  borderRadius: 2,
                  border: '1px solid #E9E9EF',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                }}
              >
                <Stack
                  onClick={() => {
                    onDuplicate();
                    setMenuAnchor(null);
                  }}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    fontSize: 14,
                    '&:hover': { bgcolor: '#F4F5F9' },
                  }}
                >
                  <Icon component={ICON_COPY} sx={{ width: 16, height: 16 }} />
                  Duplicate
                </Stack>

                <Stack
                  onClick={() => {
                    onDelete();
                    setMenuAnchor(null);
                  }}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    color: '#D75B5B',
                    fontSize: 14,
                    '&:hover': { bgcolor: '#F4F5F9' },
                  }}
                >
                  <Icon
                    component={ICON_TRASH}
                    sx={{ width: 16, height: 16, color: '#D75B5B' }}
                  />
                  Delete
                </Stack>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Box>
      </Stack>
    </Stack>
  );
};
