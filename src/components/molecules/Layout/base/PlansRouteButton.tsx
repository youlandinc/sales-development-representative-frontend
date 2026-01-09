import { Fade, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import { useShallow } from 'zustand/react/shallow';

import { useCurrentPlanStore } from '@/stores/useCurrentPlanStore';

import { PlanTypeEnum } from '@/types';

import ICON_VIEW from '../assets/icon_view_plan.svg';

export const PlansRouteButton = () => {
  const router = useRouter();
  const { planList, isLoading } = useCurrentPlanStore(
    useShallow((state) => ({
      planList: state.planList,
      isLoading: state.isLoading,
    })),
  );

  const hasPlan = planList.some((plan) => plan.planType !== PlanTypeEnum.free);
  const onClickToViewPlans = () => {
    router.push('/plans');
  };

  if (isLoading || planList.length === 0) {
    return null;
  }

  return (
    <Fade in>
      <Stack
        alignItems={'center'}
        direction={'row'}
        gap={0.5}
        onClick={onClickToViewPlans}
        sx={{
          cursor: 'pointer',
          p: '6px',
          borderRadius: 2,
          '&:hover': {
            bgcolor: '#F4F5F9',
          },
        }}
      >
        <Icon
          component={ICON_VIEW}
          sx={{
            width: 16,
            height: 16,
          }}
        />
        <Typography
          className={'plans_label'}
          sx={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.5,
            color: '#363440',
          }}
        >
          {hasPlan ? 'View all plans' : 'Select a plan'}
        </Typography>
      </Stack>
    </Fade>
  );
};
