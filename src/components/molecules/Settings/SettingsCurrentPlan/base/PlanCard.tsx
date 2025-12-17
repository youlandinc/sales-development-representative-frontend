import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { FC, useMemo } from 'react';

import { CREDIT_TYPE_LABELS } from '../data';

import { CreditTypeEnum } from '@/types/pricingPlan';
import { PlanStatusEnum, PlanTypeEnum } from '@/types';

import { CancelButton, PlanBadge, RefreshInfo, RenewalInfo } from './index';

// ============ Helper Functions ============

const calculateProgress = (
  fullAccess: boolean,
  currentValue?: number,
  totalValue?: number,
): number => {
  if (fullAccess) {
    return 100;
  }

  if (
    currentValue !== undefined &&
    totalValue !== undefined &&
    totalValue > 0
  ) {
    return currentValue > totalValue ? 100 : (currentValue / totalValue) * 100;
  }

  return 0;
};

const getDisplayText = (
  fullAccess: boolean,
  currentValue?: number,
  totalValue?: number,
  unit?: CreditTypeEnum,
): string => {
  if (fullAccess) {
    return 'Full access';
  }

  const unitText = unit ? unit.toLowerCase() + 's' : 'credits';
  const current = currentValue?.toLocaleString() ?? 0;
  const total = totalValue?.toLocaleString() ?? 0;

  return `${current} / ${total} ${unitText} left`;
};

const getUnitLabel = (unit?: CreditTypeEnum): string => {
  return unit ? CREDIT_TYPE_LABELS[unit] : 'Credits';
};

const shouldShowRefreshInfo = (
  refreshDays: number | undefined,
  status: PlanStatusEnum,
  unit?: CreditTypeEnum,
): boolean => {
  return (
    refreshDays !== undefined &&
    status === PlanStatusEnum.succeeded &&
    unit !== CreditTypeEnum.full_access
  );
};

export interface PlanCardProps {
  planName: string;
  // category: PlanTypeEnum;
  planBadge: {
    label: string;
    bgColor: string;
    textColor: string;
    gradient?: boolean;
  };
  currentValue?: number;
  totalValue?: number;
  unit?: CreditTypeEnum;
  refreshDays?: number;
  renewalDate?: string;
  fullAccess?: boolean; // For plans with full access (no limits)
  onCancel?: () => void;
  status: PlanStatusEnum;
  planType: PlanTypeEnum;
}

export const PlanCard: FC<PlanCardProps> = ({
  planName,
  planBadge,
  currentValue,
  totalValue,
  unit,
  refreshDays,
  renewalDate,
  fullAccess = false,
  onCancel,
  status,
}) => {
  const progress = useMemo(
    () => calculateProgress(fullAccess, currentValue, totalValue),
    [currentValue, totalValue, fullAccess],
  );

  const displayText = useMemo(
    () => getDisplayText(fullAccess, currentValue, totalValue, unit),
    [fullAccess, currentValue, totalValue, unit],
  );

  const unitLabel = useMemo(() => getUnitLabel(unit), [unit]);

  const showRefreshInfo = shouldShowRefreshInfo(refreshDays, status, unit);
  const hasFooterContent = showRefreshInfo || renewalDate;

  return (
    <Box
      sx={{
        bgcolor: '#F4F5F9',
        borderRadius: 2,
        p: 2,
        width: '100%',
      }}
    >
      <Stack gap={1}>
        {/* Header */}
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Stack alignItems="center" direction="row" gap={1}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {planName}
            </Typography>
            <PlanBadge {...planBadge} />
          </Stack>
          <CancelButton onCancel={onCancel} status={status} />
        </Stack>

        {/* Progress section */}
        <Stack gap={0.5}>
          <Typography
            sx={{
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {displayText}
          </Typography>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: '#F0F0F4',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#363440',
                borderRadius: 1,
              },
            }}
            value={progress}
            variant="determinate"
          />
        </Stack>

        {/* Footer info */}
        {hasFooterContent && (
          <Stack
            alignItems="center"
            direction="row"
            justifyContent={
              showRefreshInfo && renewalDate ? 'space-between' : 'flex-start'
            }
          >
            {showRefreshInfo && refreshDays !== undefined && (
              <RefreshInfo refreshDays={refreshDays} unitLabel={unitLabel} />
            )}
            {renewalDate && (
              <RenewalInfo renewalDate={renewalDate} status={status} />
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
