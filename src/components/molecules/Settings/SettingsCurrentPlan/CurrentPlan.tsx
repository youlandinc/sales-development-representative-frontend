import { Box, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { CancelSubscriptionDialog, PaymentSetting, PlanList } from './base';
import { COLORS } from './data';

import { useCurrentPlan } from './hooks';

export const CurrentPlan: FC = () => {
  const { plans, isLoading, handleCancelClick, cancelDialog } =
    useCurrentPlan();

  return (
    <Box
      sx={{
        border: '1px solid #E5E5E5',
        borderRadius: 4,
        p: 3,
      }}
    >
      <Stack
        gap={3}
        sx={{
          width: 900,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.text.primary,
            lineHeight: 1.2,
          }}
        >
          Current plan
        </Typography>
        <PlanList
          isLoading={isLoading}
          onCancelClick={handleCancelClick}
          plans={plans}
        />

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
