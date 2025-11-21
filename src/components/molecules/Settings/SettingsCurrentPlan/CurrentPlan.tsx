import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import ArrowsClockwiseIcon from '@mui/icons-material/Autorenew';
import CalendarBlankIcon from '@mui/icons-material/CalendarToday';

interface PlanCardProps {
  planName: string;
  planBadge: {
    label: string;
    bgColor: string;
    textColor: string;
    gradient?: boolean;
  };
  currentValue: number;
  totalValue: number;
  unit: string;
  refreshDays: number;
  renewalDate: string;
  onCancel?: () => void;
}

const PlanCard: FC<PlanCardProps> = ({
  planName,
  planBadge,
  currentValue,
  totalValue,
  unit,
  refreshDays,
  renewalDate,
  onCancel,
}) => {
  const progress = (currentValue / totalValue) * 100;

  return (
    <Box
      sx={{
        bgcolor: '#F8F8FA',
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
                color: '#363440',
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
          {onCancel && (
            <Typography
              onClick={onCancel}
              sx={{
                fontSize: 12,
                color: '#6F6C7D',
                cursor: 'pointer',
                lineHeight: 1.5,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Cancel subscription
            </Typography>
          )}
        </Stack>

        {/* Progress section */}
        <Stack gap={0.5}>
          <Typography
            sx={{
              fontSize: 14,
              color: '#363440',
              lineHeight: 1.4,
            }}
          >
            {currentValue.toLocaleString()} / {totalValue.toLocaleString()}{' '}
            {unit} left
          </Typography>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: '#EAE9EF',
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
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Stack alignItems="center" direction="row" gap={0.5}>
            <ArrowsClockwiseIcon sx={{ fontSize: 16, color: '#363440' }} />
            <Typography
              sx={{
                fontSize: 12,
                color: '#363440',
                lineHeight: 1.5,
              }}
            >
              {unit === 'records' ? 'Records' : 'Credits'} refresh in{' '}
              {refreshDays} days
            </Typography>
          </Stack>
          <Stack alignItems="center" direction="row" gap={0.5}>
            <CalendarBlankIcon sx={{ fontSize: 16, color: '#363440' }} />
            <Typography
              sx={{
                fontSize: 12,
                color: '#363440',
                lineHeight: 1.5,
              }}
            >
              Renews on {renewalDate}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export const CurrentPlan: FC = () => {
  // Mock data - replace with actual data from API
  const plans = [
    {
      planName: 'Business & Corporate - Annual',
      planBadge: {
        label: 'Business',
        bgColor: '#EADFFF',
        textColor: '#823FC6',
      },
      currentValue: 12000,
      totalValue: 12000,
      unit: 'records',
      refreshDays: 233,
      renewalDate: 'Dec 14, 2026',
    },
    {
      planName: 'Enrichment - Monthly',
      planBadge: {
        label: 'Pro',
        bgColor: '#363440',
        textColor: '#FEF0D6',
        gradient: true,
      },
      currentValue: 640,
      totalValue: 2000,
      unit: 'credits',
      refreshDays: 23,
      renewalDate: 'Dec 14, 2025',
    },
  ];

  return (
    <Stack gap={3} sx={{ width: 900 }}>
      {/* Title */}
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: '#363440',
          lineHeight: 1.2,
        }}
      >
        Current plan
      </Typography>

      {/* Plan cards */}
      <Stack gap={1.5}>
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            {...plan}
            onCancel={() => {
              // Handle cancel subscription
              console.log('Cancel subscription for', plan.planName);
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};
