import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { SDRToast } from '@/components/atoms';
import { useAsyncFn, useSwitch } from '@/hooks';
import { _createPaymentLink, _reactivatePlan } from '@/request/pricingPlan';
import { useCurrentPlanStore } from '@/stores/useCurrentPlanStore';
import { DirectoriesBizIdEnum } from '@/types/directories';
import { PaymentTypeEnum, PlanInfo } from '@/types/pricingPlan';

import {
  CANCEL_URL,
  COLORS,
  hasPrice,
  isCancelledPlan,
  isPaidPlan,
  SUCCESS_URL,
} from '../data';

interface UsePricingPlanCardParams {
  plan: PlanInfo;
  paymentType?: PaymentTypeEnum | string;
  category: string;
}

export const usePricingPlanCard = ({
  plan,
  paymentType,
  category,
}: UsePricingPlanCardParams) => {
  const { visible, toggle } = useSwitch();

  const { paidPlan, sendEmailPlan, cancelledPlan } = useCurrentPlanStore(
    useShallow((state) => ({
      paidPlan: state.paidPlan,
      sendEmailPlan: state.sendEmailPlan,
      cancelledPlan: state.cancelledPlan,
    })),
  );

  // Computed states
  const isHighlighted = plan.isDefault;
  const isPaid = isPaidPlan(plan.planType, paidPlan);
  const isCancelled = isCancelledPlan(plan.planType, cancelledPlan);
  const isEmailSent = sendEmailPlan.includes(plan.planType);
  const isCapitalMarkets = category === DirectoriesBizIdEnum.capital_markets;

  // Button configuration
  // Priority: isPaid > isCancelled > isCapitalMarkets > hasPrice > isDefault > fallback
  const buttonConfig = useMemo(() => {
    const variant = plan.isDefault
      ? ('contained' as const)
      : ('outlined' as const);

    // 1. Already paid - show current plan
    if (isPaid) {
      return {
        text: 'Current plan',
        variant: 'contained' as const,
        showIcon: true,
      };
    }

    // 2. Cancelled - show resume option
    if (isCancelled) {
      return { text: 'Resume subscription', variant };
    }

    // 3. Capital markets - always request access
    if (isCapitalMarkets) {
      return { text: 'Request access', variant: 'outlined' as const };
    }

    // 4. Has price - show choose plan
    if (hasPrice(plan)) {
      return { text: 'Choose plan', variant };
    }

    // 5. Default plan without price - talk to team
    if (plan.isDefault) {
      return { text: 'Talk to our team', variant: 'contained' as const };
    }

    // 6. Fallback - request access
    return { text: 'Request access', variant: 'outlined' as const };
  }, [isPaid, isCancelled, isCapitalMarkets, plan]);

  // Button styles
  const buttonStyles = useMemo(
    () => ({
      bgcolor:
        buttonConfig.variant === 'contained' ? COLORS.PRIMARY : 'transparent',
      color: buttonConfig.variant === 'contained' ? 'white' : 'text.primary',
      borderColor:
        buttonConfig.variant === 'outlined' ? COLORS.BORDER : 'transparent',
      '&:hover': {
        bgcolor:
          buttonConfig.variant === 'contained' ? COLORS.PRIMARY : 'transparent',
      },
    }),
    [buttonConfig.variant],
  );

  const [state, createPaymentLink] = useAsyncFn(async () => {
    try {
      const { data } = await _createPaymentLink({
        successUrl: SUCCESS_URL,
        cancelUrl: CANCEL_URL,
        planType: plan.planType,
        pricingType: paymentType as PaymentTypeEnum,
      });
      if (data) {
        window.location.href = data;
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [paymentType, plan.planType]);

  const [reactivateState, reactivatePlan] = useAsyncFn(async () => {
    try {
      const { data } = await _reactivatePlan({
        planType: plan.planType,
        cancelUrl: CANCEL_URL,
      });
      if (data) {
        window.location.href = data;
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [plan.planType]);

  const onClickToCreatePayment = () => {
    if (isCancelled) {
      reactivatePlan();
      return;
    }
    if (!plan.monthlyPrice && !plan.yearlyPrice) {
      toggle();
      return;
    }
    createPaymentLink();
  };

  return {
    // Dialog state
    visible,
    toggle,
    // Computed states
    isHighlighted,
    isPaid,
    isCancelled,
    isEmailSent,
    isCapitalMarkets,
    // Button
    buttonConfig,
    buttonStyles,
    // Payment
    isLoading: state.loading || reactivateState.loading,
    onClickToCreatePayment,
  };
};
