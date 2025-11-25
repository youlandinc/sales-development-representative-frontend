import { useState } from 'react';
import useSwr from 'swr';
import { format } from 'date-fns';

import { SDRToast } from '@/components/atoms';

import {
  computedStyle,
  FULL_ACCESS_PLAN_TYPES,
  PREMIUM_PLAN_TYPES,
} from '../data';

import { PlanCardProps } from '../base';
import { PlanTypeEnum } from '@/types';
import { HttpError } from '@/types';

import { _cancelPlan, _fetchCurrentPlan } from '@/request/settings';

import { useAsyncFn } from '@/hooks';

export const useCurrentPlan = () => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    planName: string;
    renewalDate: string;
    category: PlanTypeEnum;
  } | null>(null);

  const { data, isLoading, mutate } = useSwr(
    'current-plan',
    _fetchCurrentPlan,
    {
      revalidateOnFocus: false,
    },
  );

  const plans: PlanCardProps[] = (data?.data?.currentPlans || []).map(
    (plan) => {
      const style = computedStyle(plan.planType);
      const isPremium = PREMIUM_PLAN_TYPES.includes(
        plan.planType as (typeof PREMIUM_PLAN_TYPES)[number],
      );
      const isFullAccess = FULL_ACCESS_PLAN_TYPES.includes(
        plan.planType as (typeof FULL_ACCESS_PLAN_TYPES)[number],
      );

      return {
        planName: plan.categoryName,
        category: plan.category,
        planBadge: {
          label: plan.planName,
          bgColor: style.bgcolor,
          textColor: style.color,
          gradient: isPremium,
        },
        fullAccess: isFullAccess,
        unit: plan.creditType,
        renewalDate: format(new Date(plan.planEndTime), 'MMM dd, yyyy'),
        refreshDays: plan.remainingDays,
        totalValue: plan.totalCredits,
        // currentValue: plan.totalCredits - plan.usedCredits, // 剩余额度
        currentValue: plan.remainingCredits, // 剩余额度
        status: plan.status,
      };
    },
  );

  const [cancelState, handleConfirmCancellation] = useAsyncFn(async () => {
    if (!selectedPlan) {
      return;
    }
    try {
      await _cancelPlan(selectedPlan.category);
      setCancelDialogOpen(false);
      setSelectedPlan(null);
      mutate();
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [selectedPlan]);

  const handleCancelClick = (
    planName: string,
    category: PlanTypeEnum,
    renewalDate?: string,
  ) => {
    setSelectedPlan({ planName, renewalDate: renewalDate ?? '', category });
    setCancelDialogOpen(true);
  };

  return {
    cancelDialogOpen,
    selectedPlan,
    plans,
    isLoading,
    handleCancelClick,
    handleConfirmCancellation,
    setCancelDialogOpen,
    setSelectedPlan,
    cancelState,
  };
};
