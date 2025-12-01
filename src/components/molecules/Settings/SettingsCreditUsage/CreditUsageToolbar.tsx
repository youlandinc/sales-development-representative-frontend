import { ListSubheader, MenuItem, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { FC, useState } from 'react';

import { StyledSelect } from '@/components/atoms';
import { DateRangeDialog } from './DateRangeDialog';

import { PlanCategoryEnum } from '@/types';
import {
  DateRangeEnum,
  FetchCreditUsageListRequest,
  UsageTypeOptions,
} from '@/types/Settings/creditUsage';

import {
  computedPlanBadgeStyle,
  PlanBadge,
  PREMIUM_PLAN_TYPES,
} from '@/components/molecules/Settings/SettingsCurrentPlan';
import { DATE_RANGE_OPTIONS, formatDateRange } from './data';

interface CreditUsageToolbarProps {
  onChange: (
    conditions: Omit<FetchCreditUsageListRequest, 'page' | 'size'>,
  ) => void;
  value: Omit<FetchCreditUsageListRequest, 'page' | 'size'>;
  usageTypeList: UsageTypeOptions[];
}
export const CreditUsageToolbar: FC<CreditUsageToolbarProps> = ({
  onChange,
  value,
  usageTypeList,
}) => {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [customRangeLabel, setCustomRangeLabel] = useState<string>('');
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

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
              category: e.target.value as PlanCategoryEnum,
            });
          }}
          options={usageTypeList || []}
          renderOption={(option: any, index) => {
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
                  gap: 1.25,
                }}
                value={option.value}
              >
                {option.label}{' '}
                {option.planType ? (
                  <PlanBadge
                    {...computedPlanBadgeStyle(option.planType)}
                    gradient={PREMIUM_PLAN_TYPES.includes(
                      option.planType as (typeof PREMIUM_PLAN_TYPES)[number],
                    )}
                    label={option.planName}
                  />
                ) : null}
              </MenuItem>
            );
          }}
          renderValue={(value: any) => {
            const option = usageTypeList?.find((item) => item.value === value);
            return (
              <Stack alignItems={'center'} direction={'row'} gap={0.5}>
                {option?.label}
                {option?.planType ? (
                  <PlanBadge
                    {...computedPlanBadgeStyle(option.planType)}
                    gradient={PREMIUM_PLAN_TYPES.includes(
                      option.planType as (typeof PREMIUM_PLAN_TYPES)[number],
                    )}
                    label={option.planName || ''}
                  />
                ) : null}
              </Stack>
            );
          }}
          sxList={{
            '& .MuiMenuItem-root:hover': {
              bgcolor: '#F8F8FA !important',
            },
            '& .Mui-selected:hover': {
              bgcolor: '#EAE9EF !important',
            },
          }}
          value={value.category}
        />
      </Stack>

      <StyledSelect
        menuPaperSx={{
          px: 3,
          py: 2,
        }}
        onChange={(e) => {
          const v = e.target.value;
          if (v === DateRangeEnum.range) {
            setDateDialogOpen(true);
            // 不更新 dateType，保持当前值
          } else {
            // 清空自定义范围标签
            setCustomRangeLabel('');
            onChange?.({
              ...value,
              dateType: v as string,
              startTime: undefined,
              endTime: undefined,
            });
          }
        }}
        options={DATE_RANGE_OPTIONS}
        renderOption={(option) => {
          return (
            <MenuItem
              key={option.key}
              onClick={() => {
                // 如果是 range 选项，直接打开对话框
                if (option.value === DateRangeEnum.range) {
                  setDateDialogOpen(true);
                } else {
                  // 其他选项正常处理
                  setCustomRangeLabel('');
                  onChange?.({
                    ...value,
                    dateType: option.value as string,
                    startTime: undefined,
                    endTime: undefined,
                  });
                }
              }}
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
        renderValue={(value) => {
          // 如果是自定义范围且有自定义标签，显示自定义标签
          if (value === DateRangeEnum.range && customRangeLabel) {
            return customRangeLabel;
          }
          return formatDateRange(value as DateRangeEnum);
        }}
        sx={{ width: 320 }}
        sxList={{
          '& .MuiMenuItem-root': {
            py: '8px',
            px: 1.5,
            lineHeight: 1.5,
            borderRadius: 2,
          },
          '& .MuiMenuItem-root:hover': {
            bgcolor: '#F8F8FA !important',
          },
          '& .Mui-selected:hover': {
            bgcolor: '#EAE9EF !important',
          },
        }}
        value={value.dateType}
      />

      <DateRangeDialog
        endDate={tempEndDate}
        onClose={() => {
          setDateDialogOpen(false);
          // 关闭时清空临时状态
          setTempStartDate(null);
          setTempEndDate(null);
        }}
        onConfirm={() => {
          if (tempStartDate) {
            const dateFormat = 'MMM d, yyyy';
            const formattedStart = format(tempStartDate, dateFormat);

            let label: string;
            if (tempEndDate) {
              const formattedEnd = format(tempEndDate, dateFormat);
              label = `${formattedStart} - ${formattedEnd}`;
            } else {
              label = `From ${formattedStart}`;
            }

            setCustomRangeLabel(label);
            onChange?.({
              ...value,
              dateType: DateRangeEnum.range,
              startTime: tempStartDate.toISOString(),
              endTime: tempEndDate?.toISOString(),
            });
          }
        }}
        onEndDateChange={setTempEndDate}
        onStartDateChange={setTempStartDate}
        open={dateDialogOpen}
        startDate={tempStartDate}
      />
    </Stack>
  );
};
