import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import useSwr from 'swr';

import { SDRToast } from '@/components/atoms';

import {
  computedPlanBadgeStyle,
  FULL_ACCESS_PLAN_TYPES,
  PREMIUM_PLAN_TYPES,
} from '../data';

import { HttpError, PlanTypeEnum } from '@/types';
import { PlanCardProps } from '../base';

import { _cancelPlan, _fetchCurrentPlan } from '@/request/settings';

import { useAsyncFn } from '@/hooks';

export interface SelectedPlan {
  planName: string;
  renewalDate: string;
  category: PlanTypeEnum;
}

export const useCurrentPlan = () => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);

  const { data, isLoading, mutate } = useSwr(
    'current-plan',
    _fetchCurrentPlan,
    {
      revalidateOnFocus: false,
    },
  );

  const plans: PlanCardProps[] = (data?.data?.currentPlans || []).map(
    (plan) => {
      const style = computedPlanBadgeStyle(plan.planType);
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
          bgColor: style.bgColor,
          textColor: style.textColor,
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

  const handleCancelClick = useCallback(
    (planName: string, category: PlanTypeEnum, renewalDate?: string) => {
      setSelectedPlan({ planName, renewalDate: renewalDate ?? '', category });
      setCancelDialogOpen(true);
    },
    [],
  );

  const handleCloseDialog = useCallback(() => {
    setCancelDialogOpen(false);
    setSelectedPlan(null);
  }, []);

  return {
    plans,
    isLoading,
    handleCancelClick,
    cancelDialog: {
      open: cancelDialogOpen,
      selectedPlan,
      loading: cancelState.loading,
      onClose: handleCloseDialog,
      onConfirm: handleConfirmCancellation,
    },
  };
};
