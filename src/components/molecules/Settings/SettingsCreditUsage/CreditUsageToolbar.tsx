import { ListSubheader, MenuItem, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';

import { StyledSelect } from '@/components/atoms';
import { DateRangeDialog } from './DateRangeDialog';

import { PlanTypeEnum } from '@/types';
import {
  DateRangeEnum,
  FetchCreditUsageListRequest,
} from '@/types/Settings/creditUsage';

import { DATE_RANGE_OPTIONS, formatDateRange } from './data';

interface CreditUsageToolbarProps {
  onChange: (
    conditions: Omit<FetchCreditUsageListRequest, 'page' | 'size'>,
  ) => void;
  value: Omit<FetchCreditUsageListRequest, 'page' | 'size'>;
  usageTypeList: TOption[];
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
          options={usageTypeList || []}
          renderOption={(option, index) => {
            if (option.disabled) {
              return (
                <ListSubheader
                  sx={{
                    pt: index === 0 ? '0 !important' : '8px !important',
                    pb: '8px !important',
                    px: '0 !important',
                    lineHeight: 1.5,
                    color: 'text.secondary',
                  }}
                >
                  {option.label}
                </ListSubheader>
              );
            }
            return (
              <MenuItem
                key={option.key}
                sx={{
                  px: 1.5,
                  py: '8px !important',
                  borderRadius: 2,
                }}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            );
          }}
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
          if (v === DateRangeEnum.range) {
            setDateDialogOpen(true);
          } else {
            onChange?.({
              ...value,
              dateType: v as string,
            });
          }
        }}
        options={DATE_RANGE_OPTIONS}
        renderValue={(value) => {
          return formatDateRange(value as DateRangeEnum);
        }}
        sx={{ width: 320 }}
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
          // '& .Mui-selected': {
          //   bgcolor: '#EAE9EF !important',
          // },
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
