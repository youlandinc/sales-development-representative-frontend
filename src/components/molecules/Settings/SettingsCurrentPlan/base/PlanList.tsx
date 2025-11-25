import { Stack } from '@mui/material';
import { FC, useCallback } from 'react';

import { PlanCard, PlanCardProps } from '.';
import { PlanListState } from './PlanListState';
import { PlanTypeEnum } from '@/types';

interface PlanListProps {
  plans: PlanCardProps[];
  isLoading: boolean;
  onCancelClick: (
    planName: string,
    planType: PlanTypeEnum,
    renewalDate?: string,
  ) => void;
}

export const PlanList: FC<PlanListProps> = ({
  plans,
  isLoading,
  onCancelClick,
}) => {
  const handleCancel = useCallback(
    (plan: PlanCardProps) => () => {
      if (plan.renewalDate) {
        onCancelClick(plan.planName, plan.planType, plan.renewalDate);
      }
    },
    [onCancelClick],
  );

  if (isLoading) {
    return <PlanListState message="Loading plans..." />;
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
          onCancel={plan.renewalDate ? handleCancel(plan) : undefined}
        />
      ))}
    </Stack>
  );
};
