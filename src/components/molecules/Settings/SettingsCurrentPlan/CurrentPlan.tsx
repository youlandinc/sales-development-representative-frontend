import { Box, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { CancelSubscriptionDialog, PaymentSetting, PlanList } from './base';

import { useCurrentPlan } from './hooks';

export const CurrentPlan: FC = () => {
  const { plans, isLoading, onClickToCancelPlan, cancelDialog } =
    useCurrentPlan();

  return (
    <Box>
      <Stack
        gap={3}
        sx={{
          width: 900,
        }}
      >
        <Stack
          gap={3}
          sx={{
            border: '1px solid #E5E5E5',
            borderRadius: 4,
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Current plan
          </Typography>
          <PlanList
            isLoading={isLoading}
            onClickToCancelPlan={onClickToCancelPlan}
            plans={plans}
          />
        </Stack>
        <PaymentSetting />

        {cancelDialog.selectedPlan && (
          <CancelSubscriptionDialog
            endDate={cancelDialog.selectedPlan.renewalDate}
            loading={cancelDialog.loading}
            onClose={cancelDialog.onClose}
            onConfirm={cancelDialog.onConfirm}
            open={cancelDialog.open}
            planName={cancelDialog.selectedPlan.planName}
          />
        )}
      </Stack>
    </Box>
  );
};
