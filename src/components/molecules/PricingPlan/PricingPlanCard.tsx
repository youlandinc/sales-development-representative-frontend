import { Box, Icon, Stack, Typography } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { FC, useMemo } from 'react';

import { SDRToast, StyledButton } from '@/components/atoms';
import { useAsyncFn, useSwitch } from '@/hooks';
import { useCurrentPlanStore } from '@/stores/useCurrentPlanStore';

import { PlanTypeEnum } from '@/types';
import { DirectoriesBizIdEnum } from '@/types/directories';
import { PaymentTypeEnum, PlanInfo } from '@/types/pricingPlan';

import { _createPaymentLink } from '@/request/pricingPlan';
import {
  CANCEL_URL,
  packageTitle,
  PERIOD_INFO,
  PRICE_INFO,
  SUCCESS_URL,
} from './data';
import { StyledCapitalDesc } from './base';
import { TalkToTeamDialog } from './TalkToTeamDialog';

import ICON_NORMAL from './assets/icon_normal.svg';
import ICON_PRO from './assets/icon_pro.svg';
import ICON_CHECKED from './assets/icon_checked.svg';
import ICON_CONFETTI from './assets/icon_confetti_bold.svg';

// Constants
const COLORS = {
  PRIMARY: '#363440',
  BORDER: '#DFDEE6',
  BACKGROUND: '#EAE9EF',
} as const;

const DIMENSIONS = {
  CARD_WIDTH: 384,
  MIN_HEIGHT: 496,
  ICON_SIZE: { width: 258, height: 310 },
} as const;

const UNLIMITED_PLAN_TYPES = [
  PlanTypeEnum.institutional,
  PlanTypeEnum.enterprise,
] as const;

// Helper functions
const isPaidPlan = (planType: PlanTypeEnum, paidPlans: PlanTypeEnum[]) => {
  return planType === PlanTypeEnum.free || paidPlans.includes(planType);
};

const hasPrice = (plan: PlanInfo) => {
  return Boolean(plan.monthlyPrice && plan.yearlyPrice);
};

const isUnlimitedPlan = (planType: PlanTypeEnum) => {
  return UNLIMITED_PLAN_TYPES.includes(planType as any);
};

interface PricingCardProps {
  plan: PlanInfo;
  paymentType?: PaymentTypeEnum | string;
  category: string;
}

// Price Display Component
const PriceDisplay: FC<{
  plan: PlanInfo;
  paymentType?: PaymentTypeEnum | string;
}> = ({ plan, paymentType }) => {
  if (!plan.monthlyPrice && !plan.yearlyPrice) {
    return null;
  }

  const price =
    paymentType === PaymentTypeEnum.YEARLY
      ? plan.yearlyPrice
      : plan.monthlyPrice;

  if (!price) {
    return null;
  }

  return (
    <Stack
      gap={1}
      sx={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        minHeight: 36,
      }}
    >
      <Typography
        sx={{
          fontSize: 36,
          fontWeight: 400,
          lineHeight: 1,
        }}
      >
        ${price.toLocaleString()}
      </Typography>
      <Typography fontSize={15} lineHeight={1.5}>
        per month
      </Typography>
      {plan.priceAdditionalInfo && (
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 400,
            lineHeight: 1,
            color: 'text.secondary',
            ml: 1,
          }}
        >
          {plan.priceAdditionalInfo}
        </Typography>
      )}
    </Stack>
  );
};

// Email Sent Status Component
const EmailSentStatus: FC = () => (
  <Stack gap={3}>
    <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
      <Icon component={ICON_CONFETTI} sx={{ width: 21, height: 21 }} />
      <Typography fontWeight={400} lineHeight={1} variant={'h4'}>
        Request received
      </Typography>
    </Stack>
    <Typography lineHeight={1.4} variant={'body2'}>
      Our team will contact you as soon as possible to discuss next steps.
    </Typography>
  </Stack>
);

export const PricingPlanCard: FC<PricingCardProps> = ({
  plan,
  paymentType,
  category,
}) => {
  const { visible, toggle } = useSwitch();
  const paidPlan = useCurrentPlanStore((state) => state.paidPlan);
  const sendEmailPlan = useCurrentPlanStore((state) => state.sendEmailPlan);

  // Computed states
  const isHighlighted = plan.isDefault;
  const isPaid = isPaidPlan(plan.planType, paidPlan);
  const isEmailSent = sendEmailPlan.includes(plan.planType);
  const isCapitalMarkets = category === DirectoriesBizIdEnum.capital_markets;

  // Button configuration
  const buttonConfig = useMemo(() => {
    if (isPaid) {
      return {
        text: 'Current plan',
        variant: 'contained' as const,
        showIcon: true,
      };
    }
    if (isCapitalMarkets) {
      return { text: 'Request access', variant: 'outlined' as const };
    }
    if (hasPrice(plan)) {
      return { text: 'Choose plan', variant: 'contained' as const };
    }
    if (plan.isDefault) {
      return { text: 'Talk to our team', variant: 'outlined' as const };
    }
    return { text: 'Request access', variant: 'outlined' as const };
  }, [isCapitalMarkets, plan, isPaid]);

  const [state, createPaymentLink] = useAsyncFn(async () => {
    try {
      const { data } = await _createPaymentLink({
        successUrl: SUCCESS_URL,
        cancelUrl: CANCEL_URL,
        planType: plan.planType,
        pricingType: paymentType as PaymentTypeEnum,
      });
      // 这里可以处理重定向逻辑
      if (data) {
        window.location.href = data;
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [paymentType, plan.planType]);

  const handleClick = () => {
    if (!plan.monthlyPrice && !plan.yearlyPrice) {
      toggle();
      return;
    }
    createPaymentLink();
  };

  // Price description
  const priceDesc = useMemo(() => {
    if (isCapitalMarkets || !plan.creditType) {
      return null;
    }

    if (isUnlimitedPlan(plan.planType)) {
      return <Typography>Unlimited verified records</Typography>;
    }

    if (!plan.credit) {
      return null;
    }

    const isYearly = paymentType === PaymentTypeEnum.YEARLY;
    const creditAmount = isYearly ? plan.credit * 12 : plan.credit;
    const creditLabel = PRICE_INFO[plan.creditType] || '';
    const periodLabel =
      plan.planType === PlanTypeEnum.free
        ? isYearly
          ? 'per year'
          : 'per month'
        : PERIOD_INFO[paymentType as PaymentTypeEnum] || '';

    return (
      <Typography>
        {creditAmount.toLocaleString()} {creditLabel} {periodLabel}
      </Typography>
    );
  }, [isCapitalMarkets, plan, paymentType]);

  return (
    <Stack
      sx={{
        width: DIMENSIONS.CARD_WIDTH,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative dot pattern overlay */}
      <Icon
        component={plan.isDefault ? ICON_PRO : ICON_NORMAL}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          ...DIMENSIONS.ICON_SIZE,
        }}
      />
      {/* Card Header */}
      <Box
        sx={{
          bgcolor: isHighlighted ? COLORS.PRIMARY : COLORS.BACKGROUND,
          p: 3,
          borderRadius: '24px 24px 0 0',
        }}
      >
        <Typography
          sx={{
            color: isHighlighted ? 'white' : 'text.primary',
            lineHeight: 1.2,
          }}
          variant="h4"
        >
          {plan.planName}
        </Typography>
      </Box>

      {/* Card Body */}
      <Box
        sx={{
          bgcolor: isHighlighted ? COLORS.PRIMARY : COLORS.BACKGROUND,
          borderRadius: '0 0 24px 24px',
        }}
      >
        <Stack
          sx={{
            bgcolor: 'background.default',
            border: `1px solid ${isHighlighted ? COLORS.PRIMARY : COLORS.BORDER}`,
            borderRadius: 6,
            p: 3,
            gap: 3,
            minHeight: DIMENSIONS.MIN_HEIGHT,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {isEmailSent ? (
            <EmailSentStatus />
          ) : (
            <>
              {isCapitalMarkets ? (
                <StyledCapitalDesc
                  planType={plan.planType}
                  priceAdditionalInfo={plan.priceAdditionalInfo || ''}
                />
              ) : (
                <PriceDisplay paymentType={paymentType} plan={plan} />
              )}

              {/* Button */}
              <StyledButton
                disabled={isPaid}
                fullWidth
                loading={state.loading}
                onClick={handleClick}
                size="medium"
                sx={{
                  bgcolor:
                    buttonConfig.variant === 'contained'
                      ? COLORS.PRIMARY
                      : 'transparent',
                  color:
                    buttonConfig.variant === 'contained'
                      ? 'white'
                      : 'text.primary',
                  borderColor:
                    buttonConfig.variant === 'outlined'
                      ? COLORS.BORDER
                      : 'transparent',
                  '&:hover': {
                    bgcolor:
                      buttonConfig.variant === 'contained'
                        ? COLORS.PRIMARY
                        : 'transparent',
                  },
                }}
                variant={buttonConfig.variant}
              >
                {buttonConfig.showIcon ? (
                  <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                    {buttonConfig.text}
                    <Icon
                      component={ICON_CHECKED}
                      sx={{ width: 16, height: 16 }}
                    />
                  </Stack>
                ) : (
                  buttonConfig.text
                )}
              </StyledButton>

              {priceDesc}
            </>
          )}

          {/* Divider */}
          <Box
            sx={{
              height: '1px',
              bgcolor: COLORS.BORDER,
              width: '100%',
            }}
          />

          {/* Features List - 从 packages 数组获取 */}
          <Stack gap={1.5}>
            {packageTitle[plan.planType] && (
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: 14,
                }}
                variant={'body2'}
              >
                {packageTitle[plan.planType]}
              </Typography>
            )}
            {plan.packages.map((pkg, idx) => (
              <Stack alignItems="flex-start" direction="row" gap={1} key={idx}>
                <CheckCircleOutline
                  sx={{
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                  }}
                />
                <Typography variant={'body2'}>{pkg}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>
      <TalkToTeamDialog
        onClose={toggle}
        open={visible}
        planType={plan.planType}
        pricingType={paymentType as PaymentTypeEnum}
      />
    </Stack>
  );
};
