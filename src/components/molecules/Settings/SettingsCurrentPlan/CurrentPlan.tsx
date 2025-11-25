import { Stack } from '@mui/material';
import { FC } from 'react';

import { CancelSubscriptionDialog, PaymentSetting } from './base';
import { PlanList, SectionTitle } from './components';
import { LAYOUT } from './data';

import { useCurrentPlan } from './hooks';

export const CurrentPlan: FC = () => {
  const { plans, isLoading, handleCancelClick, cancelDialog } =
    useCurrentPlan();

  return (
    <Stack gap={3} sx={{ width: LAYOUT.maxWidth }}>
      <SectionTitle>Current plan</SectionTitle>

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
  );
};
