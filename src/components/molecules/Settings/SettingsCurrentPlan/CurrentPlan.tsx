import { Box, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useRouter } from 'next/navigation';

import { CancelSubscriptionDialog, PaymentSetting, PlanList } from './base';

import { useCurrentPlan } from './hooks';
import { StyledButton } from '@/components/atoms';

export const CurrentPlan: FC = () => {
  const router = useRouter();
  const { plans, isLoading, onClickToCancelPlan, cancelDialog } =
    useCurrentPlan();

  const onClickToViewPlans = () => {
    router.push('/plans');
  };

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
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
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
            <StyledButton
              color={'info'}
              onClick={onClickToViewPlans}
              size={'small'}
              variant={'outlined'}
            >
              View plans
            </StyledButton>
          </Stack>
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
