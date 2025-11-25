import { Box, Icon, LinearProgress, Stack, Typography } from '@mui/material';
import { FC, useMemo } from 'react';

import { COLORS, CREDIT_TYPE_LABELS } from '../data';

import { CreditTypeEnum } from '@/types/pricingPlan';
import { PlanStatusEnum, PlanTypeEnum } from '@/types';

import ICON_REFRESH from '../assets/icon_refresh.svg';
import ICON_CALENDAR from '../assets/icon_calendar.svg';

export interface PlanCardProps {
  planName: string;
  category: PlanTypeEnum;
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
  const progress = useMemo(() => {
    if (fullAccess) {
      return 100;
    }
    if (
      currentValue !== undefined &&
      totalValue !== undefined &&
      totalValue > 0
    ) {
      return currentValue > totalValue
        ? 100
        : (currentValue / totalValue) * 100;
    }
    return 0;
  }, [currentValue, totalValue, fullAccess]);

  const displayText = useMemo(() => {
    if (fullAccess) {
      return 'Full access';
    }
    const unitText = unit ? unit.toLowerCase() + 's' : 'credits';
    return `${currentValue?.toLocaleString() ?? 0} / ${totalValue?.toLocaleString() ?? 0} ${unitText} left`;
  }, [fullAccess, currentValue, totalValue, unit]);

  const unitLabel = useMemo(() => {
    return unit ? CREDIT_TYPE_LABELS[unit] : 'Credits';
  }, [unit]);

  return (
    <Box
      sx={{
        bgcolor: COLORS.background,
        borderRadius: 1,
        p: 3,
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
                color: COLORS.text.primary,
                lineHeight: 1.2,
              }}
            >
              {planName}
            </Typography>
            <Box
              sx={{
                bgcolor: planBadge.bgColor,
                borderRadius: 0.5,
                px: 1,
                py: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: planBadge.textColor,
                  lineHeight: 1,
                  ...(planBadge.gradient && {
                    background:
                      'linear-gradient(90deg, #FEF0D6 0%, #E5CCAA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }),
                }}
              >
                {planBadge.label}
              </Typography>
            </Box>
          </Stack>
          {status === PlanStatusEnum.succeeded ? (
            <Typography
              onClick={onCancel}
              sx={{
                fontSize: 12,
                color: COLORS.text.secondary,
                cursor: 'pointer',
                lineHeight: 1.5,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Cancel subscription
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: 12,
                color: COLORS.text.secondary,
                lineHeight: 1.5,
              }}
            >
              Cancelled
            </Typography>
          )}
        </Stack>

        {/* Progress section */}
        <Stack gap={0.5}>
          <Typography
            sx={{
              fontSize: 14,
              color: COLORS.text.primary,
              lineHeight: 1.4,
            }}
          >
            {displayText}
          </Typography>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: COLORS.progress.background,
              '& .MuiLinearProgress-bar': {
                bgcolor: COLORS.progress.bar,
                borderRadius: 1,
              },
            }}
            value={progress}
            variant="determinate"
          />
        </Stack>

        {/* Footer info */}
        <Stack
          alignItems="center"
          direction="row"
          justifyContent={
            refreshDays && renewalDate ? 'space-between' : 'flex-start'
          }
        >
          {refreshDays !== undefined &&
            status === PlanStatusEnum.succeeded &&
            unit !== CreditTypeEnum.full_access && (
              <Stack alignItems="center" direction="row" gap={0.5}>
                <Icon
                  component={ICON_REFRESH}
                  sx={{ fontSize: 16, color: COLORS.text.primary }}
                />
                <Typography
                  sx={{
                    fontSize: 12,
                    color: COLORS.text.primary,
                    lineHeight: 1.5,
                  }}
                >
                  {unitLabel} refresh in {refreshDays} days
                </Typography>
              </Stack>
            )}
          {renewalDate && (
            <Stack
              alignItems="center"
              direction="row"
              gap={0.5}
              sx={{ ml: 'auto' }}
            >
              <Icon
                component={ICON_CALENDAR}
                sx={{ fontSize: 16, color: COLORS.text.primary }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  color: COLORS.text.primary,
                  lineHeight: 1.5,
                }}
              >
                {status === PlanStatusEnum.succeeded ? 'Renews' : 'Ends'} on{' '}
                {renewalDate}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
