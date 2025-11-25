import { ListSubheader, MenuItem, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';

import { StyledSelect } from '@/components/atoms';
import { DateRangeDialog } from './DateRangeDialog';

import { PlanTypeEnum } from '@/types';
import {
  FetchCreditUsageListRequest,
  FetchUsageTypeItem,
} from '@/types/Settings/creditUsage';

interface CreditUsageToolbarProps {
  onChange: (
    conditions: Omit<FetchCreditUsageListRequest, 'page' | 'size'>,
  ) => void;
  value: Omit<FetchCreditUsageListRequest, 'page' | 'size'>;
  usageTypeList: FetchUsageTypeItem[];
}
export const CreditUsageToolbar: FC<CreditUsageToolbarProps> = ({
  onChange,
  value,
  usageTypeList,
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
          menuPaperSx={{
            px: 3,
            py: 2,
          }}
          onChange={(e) => {
            onChange?.({
              ...value,
              category: e.target.value as PlanTypeEnum,
            });
          }}
          options={usageTypeList as any}
          renderOption={(options: any, index) => {
            return (
              <>
                <ListSubheader
                  sx={{
                    pt: index === 0 ? '0 !important' : '8px !important',
                    pb: '8px !important',
                    px: '0 !important',
                    lineHeight: 1.5,
                    color: 'text.secondary',
                  }}
                >
                  {options.parentCategory}
                </ListSubheader>
                {options.children.map((child: any, i: number) => (
                  <MenuItem
                    key={i}
                    sx={{
                      px: 1.5,
                      py: '8px !important',
                      borderRadius: 2,
                    }}
                    value={child.category}
                  >
                    {child.categoryName}
                  </MenuItem>
                ))}
              </>
            );
          }}
          size={'small'}
          sxList={{
            '& .MuiMenuItem-root:hover': {
              bgcolor: '#EAE9EF !important',
            },
          }}
          value={value.category}
        />
      </Stack>

      <StyledSelect
        label={'Date range'}
        menuPaperSx={{
          px: 3,
          py: 2,
        }}
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
        sxList={{
          '& .MuiMenuItem-root:hover': {
            bgcolor: '#EAE9EF !important',
          },
          '& .MuiMenuItem-root': {
            py: '8px',
            px: 1.5,
            lineHeight: 1.5,
            borderRadius: 2,
          },
          '& .Mui-selected': {
            bgcolor: '#EAE9EF !important',
          },
        }}
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
