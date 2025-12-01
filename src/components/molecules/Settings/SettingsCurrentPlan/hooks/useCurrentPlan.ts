import { useCallback, useState } from 'react';

import { SDRToast } from '@/components/atoms';

import {
  computedPlanBadgeStyle,
  FULL_ACCESS_PLAN_TYPES,
  PREMIUM_PLAN_TYPES,
} from '../data';

import { HttpError, PlanStatusEnum, PlanTypeEnum } from '@/types';
import { PlanCardProps } from '../base';

import { _cancelPlan } from '@/request/settings';

import { useAsyncFn } from '@/hooks';
import { useCurrentPlanStore } from '@/stores/useCurrentPlanStore';

export interface SelectedPlan {
  planName: string;
  renewalDate: string;
  planType: PlanTypeEnum;
}

export const useCurrentPlan = () => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const planList = useCurrentPlanStore((state) => state.planList);
  const fetchCurrentPlan = useCurrentPlanStore(
    (state) => state.fetchCurrentPlan,
  );
  const isLoading = useCurrentPlanStore((state) => state.isLoading);

  const plans: PlanCardProps[] = planList
    .filter((plan) => plan.status !== PlanStatusEnum.created)
    .map((plan) => {
      const style = computedPlanBadgeStyle(plan.planType);
      const isPremium = PREMIUM_PLAN_TYPES.includes(
        plan.planType as (typeof PREMIUM_PLAN_TYPES)[number],
      );
      const isFullAccess = FULL_ACCESS_PLAN_TYPES.includes(
        plan.planType as (typeof FULL_ACCESS_PLAN_TYPES)[number],
      );

      return {
        planName: plan.categoryName,
        // category: plan.category,
        planBadge: {
          label: plan.planName,
          bgColor: style.bgColor,
          textColor: style.textColor,
          gradient: isPremium,
        },
        fullAccess: isFullAccess,
        unit: plan.creditType,
        renewalDate: plan.planEndTime,
        refreshDays: plan.remainingDays,
        totalValue: plan.totalCredits,
        // currentValue: plan.totalCredits - plan.usedCredits, // 剩余额度
        currentValue: plan.remainingCredits, // 剩余额度
        status: plan.status,
        planType: plan.planType,
      };
    });

  const [cancelState, onClickToConfirmCancellation] = useAsyncFn(async () => {
    if (!selectedPlan) {
      return;
    }
    try {
      await _cancelPlan(selectedPlan.planType);
      await fetchCurrentPlan();
      setIsCancelDialogOpen(false);
      setSelectedPlan(null);
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [selectedPlan]);

  const onClickToCancelPlan = useCallback(
    (planName: string, planType: PlanTypeEnum, renewalDate?: string) => {
      setSelectedPlan({ planName, renewalDate: renewalDate ?? '', planType });
      setIsCancelDialogOpen(true);
    },
    [],
  );

  const onClickToCloseDialog = useCallback(() => {
    setIsCancelDialogOpen(false);
    setSelectedPlan(null);
  }, []);

  return {
    plans,
    isLoading,
    onClickToCancelPlan,
    cancelDialog: {
      open: isCancelDialogOpen,
      selectedPlan,
      loading: cancelState.loading,
      onClose: onClickToCloseDialog,
      onConfirm: onClickToConfirmCancellation,
    },
  };
};
