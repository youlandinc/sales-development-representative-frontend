import { Skeleton, Stack } from '@mui/material';
import { FC, useCallback } from 'react';

import { PlanCard, PlanCardProps } from '.';
import { PlanListState } from './PlanListState';
import { PlanTypeEnum } from '@/types';

interface PlanListProps {
  plans: PlanCardProps[];
  isLoading: boolean;
  onClickToCancelPlan: (
    planName: string,
    planType: PlanTypeEnum,
    renewalDate?: string,
  ) => void;
}

export const PlanList: FC<PlanListProps> = ({
  plans,
  isLoading,
  onClickToCancelPlan,
}) => {
  const onClickToCancel = useCallback(
    (plan: PlanCardProps) => () => {
      if (plan.renewalDate) {
        onClickToCancelPlan(plan.planName, plan.planType, plan.renewalDate);
      }
    },
    [onClickToCancelPlan],
  );

  if (isLoading && PlanList.length === 0) {
    return <Skeleton variant="rounded" />;
  }

  if (plans.length === 0) {
    return <PlanListState message="No active plans found." />;
  }

  return (
    <Stack gap={1.5}>
      {plans.map((plan, index) => (
        <PlanCard
          key={plan.planBadge.label + index}
          {...plan}
          onCancel={plan.renewalDate ? onClickToCancel(plan) : undefined}
        />
      ))}
    </Stack>
  );
};
