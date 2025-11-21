import { Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';

import { DateRangeDialog } from './DateRangeDialog';
import { StyledSelect } from '@/components/atoms';

import { PlanTypeEnum } from '@/types';
import { FetchCreditUsageListRequest } from '@/types/Settings/creditUsage';

interface CreditUsageToolbarProps {
  onChange: (
    conditions: Omit<FetchCreditUsageListRequest, 'page' | 'size'>,
  ) => void;
  value: Omit<FetchCreditUsageListRequest, 'page' | 'size'>;
}
export const CreditUsageToolbar: FC<CreditUsageToolbarProps> = ({
  onChange,
  value,
}) => {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);

  return (
    <Stack
      alignItems={'flex-end'}
      direction={'row'}
      justifyContent={'space-between'}
    >
      <Stack sx={{ width: 320, gap: 0.5 }}>
        <Typography sx={{ fontSize: 14, color: '#363440', mb: 0.5 }}>
          Usage type
        </Typography>
        <StyledSelect
          onChange={(e) => {
            onChange?.({
              ...value,
              category: e.target.value as PlanTypeEnum,
            });
          }}
          options={[
            { value: 'Enrichment', label: 'Enrichment', key: 'Enrichment' },
            { value: 'Research', label: 'Research', key: 'Research' },
          ]}
          size={'small'}
          value={value.category}
        />
      </Stack>

      <StyledSelect
        label="Date range"
        onChange={(e) => {
          const v = e.target.value;
          if (v === 'range') {
            setDateDialogOpen(true);
          } else {
            onChange?.({
              ...value,
              dateType: v as string,
            });
          }
        }}
        options={[
          {
            value: 'This month (Nov 1, 2025 - Nov 30, 2025)',
            label: 'This month (Nov 1, 2025 - Nov 30, 2025)',
            key: 'This month (Nov 1, 2025 - Nov 30, 2025)',
          },
          { value: 'Last month', label: 'Last month', key: 'Last month' },
          {
            value: 'Last 3 months',
            label: 'Last 3 months',
            key: 'Last 3 months',
          },
          {
            value: 'Last 6 months',
            label: 'Last 6 months',
            key: 'Last 6 months',
          },
          {
            value: 'range',
            label: 'Select custom range',
            key: 'range',
          },
        ]}
        size={'small'}
        sx={{ width: 280 }}
        value={value.dateType}
      />

      <DateRangeDialog
        onClose={() => setDateDialogOpen(false)}
        onConfirm={(startDate, endDate) => {
          onChange?.({
            ...value,
            startTime: startDate?.toISOString(),
            endTime: endDate?.toISOString(),
          });
        }}
        open={dateDialogOpen}
      />
    </Stack>
  );
};
