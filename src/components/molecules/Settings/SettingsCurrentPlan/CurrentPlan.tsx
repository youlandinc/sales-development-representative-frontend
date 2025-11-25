import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { CancelSubscriptionDialog, PaymentSetting, PlanCard } from './base';

import { useCurrentPlan } from './hooks';

export const CurrentPlan: FC = () => {
  const {
    cancelDialogOpen,
    selectedPlan,
    plans,
    isLoading,
    handleCancelClick,
    handleConfirmCancellation,
    setCancelDialogOpen,
    setSelectedPlan,
    cancelState,
  } = useCurrentPlan();

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
        {isLoading ? (
          <Typography sx={{ color: '#6F6C7D', fontSize: 14 }}>
            Loading plans...
          </Typography>
        ) : plans.length === 0 ? (
          <Typography sx={{ color: '#6F6C7D', fontSize: 14 }}>
            No active plans found.
          </Typography>
        ) : (
          plans.map((plan) => (
            <PlanCard
              key={`${plan.planName}-${plan.renewalDate}`}
              {...plan}
              onCancel={
                plan.renewalDate
                  ? () =>
                      handleCancelClick(
                        plan.planName,
                        plan.category,
                        plan.renewalDate,
                      )
                  : undefined
              }
            />
          ))
        )}
      </Stack>

      {/* Payment settings */}
      <PaymentSetting />

      {/* Cancel Subscription Dialog */}
      {selectedPlan && (
        <CancelSubscriptionDialog
          endDate={selectedPlan.renewalDate}
          loading={cancelState.loading}
          onClose={() => {
            setCancelDialogOpen(false);
            setSelectedPlan(null);
          }}
          onConfirm={handleConfirmCancellation}
          open={cancelDialogOpen}
          planName={selectedPlan.planName}
        />
      )}
    </Stack>
  );
};
