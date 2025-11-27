import { Box, Icon, Stack, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { SDRToast, StyledButton } from '@/components/atoms';
import { useAsyncFn, useSwitch } from '@/hooks';
import { useCurrentPlanStore } from '@/stores/useCurrentPlanStore';

import { PlanTypeEnum } from '@/types';
import { DirectoriesBizIdEnum } from '@/types/directories';
import { PaymentTypeEnum, PlanInfo } from '@/types/pricingPlan';

import { _createPaymentLink } from '@/request/pricingPlan';
import {
  CANCEL_URL,
  COLORS,
  DIMENSIONS,
  hasPrice,
  ICON_STYLES,
  isPaidPlan,
  isUnlimitedPlan,
  packageTitle,
  PERIOD_INFO,
  PRICE_INFO,
  SUCCESS_URL,
  TYPOGRAPHY_STYLES,
} from './data';

import {
  CustomPricing,
  EmailSentStatus,
  PriceDisplay,
  SimpleTextHeader,
  StyledCapitalDesc,
} from './base';
import { TalkToTeamDialog } from './TalkToTeamDialog';

import ICON_NORMAL from './assets/icon_normal.svg';
import ICON_PRO from './assets/icon_pro.svg';
import ICON_CHECKED from './assets/icon_checked.svg';

interface PricingCardProps {
  plan: PlanInfo;
  paymentType?: PaymentTypeEnum | string;
  category: string;
}

export const PricingPlanCard: FC<PricingCardProps> = ({
  plan,
  paymentType,
  category,
}) => {
  const { visible, toggle } = useSwitch();
  const { paidPlan, sendEmailPlan } = useCurrentPlanStore(
    useShallow((state) => ({
      paidPlan: state.paidPlan,
      sendEmailPlan: state.sendEmailPlan,
    })),
  );

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
      if (plan.isDefault) {
        return { text: 'Choose plan', variant: 'contained' as const };
      }
      return { text: 'Choose plan', variant: 'outlined' as const };
    }
    if (plan.isDefault) {
      return { text: 'Talk to our team', variant: 'contained' as const };
    }
    return { text: 'Request access', variant: 'outlined' as const };
  }, [isCapitalMarkets, plan, isPaid]);

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

  const onClickToCreatePayment = () => {
    if (!plan.monthlyPrice && !plan.yearlyPrice) {
      toggle();
      return;
    }
    createPaymentLink();
  };

  // Price description
  const priceDescription = useMemo(() => {
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

  // Content header logic
  const contentHeader = useMemo(() => {
    // Email sent state
    if (isEmailSent) {
      return <EmailSentStatus />;
    }

    const isUnlimited = isUnlimitedPlan(plan.planType);

    // Paid plan with custom pricing
    if (isPaid && (isCapitalMarkets || isUnlimited)) {
      return <CustomPricing />;
    }

    // Unpaid unlimited plans
    if (isUnlimited) {
      return <SimpleTextHeader text="Request pricing" />;
    }

    // Capital markets
    if (isCapitalMarkets) {
      return (
        <StyledCapitalDesc
          planType={plan.planType}
          priceAdditionalInfo={plan.priceAdditionalInfo || ''}
        />
      );
    }

    // Free plan
    if (plan.planType === PlanTypeEnum.free) {
      return <SimpleTextHeader text="Try enrichment for free" />;
    }

    // Default: show price
    return <PriceDisplay paymentType={paymentType} plan={plan} />;
  }, [isCapitalMarkets, isEmailSent, isPaid, paymentType, plan]);

  return (
    <Stack
      sx={{
        width: DIMENSIONS.CARD_WIDTH,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: isHighlighted ? COLORS.PRIMARY : COLORS.BACKGROUND,
        borderRadius: '24px',
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
          p: 3,
        }}
      >
        <Typography
          sx={{
            color: isHighlighted ? 'white' : 'text.primary',
            lineHeight: 1.2,
            zIndex: 1,
            position: 'relative',
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
          {contentHeader}
          {!isEmailSent && (
            <>
              {/* Button */}
              <StyledButton
                disabled={isPaid}
                fullWidth
                loading={state.loading}
                onClick={onClickToCreatePayment}
                size="medium"
                sx={buttonStyles}
                variant={buttonConfig.variant}
              >
                {buttonConfig.showIcon ? (
                  <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                    {buttonConfig.text}
                    <Icon component={ICON_CHECKED} sx={ICON_STYLES.CHECKED} />
                  </Stack>
                ) : (
                  buttonConfig.text
                )}
              </StyledButton>

              {priceDescription}
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

          {/* Features List */}
          <Stack gap={1.5}>
            {isEmailSent && (
              <Typography
                sx={TYPOGRAPHY_STYLES.PACKAGE_TITLE}
                variant={'body2'}
              >
                Unlimited verified records
              </Typography>
            )}
            {packageTitle[plan.planType] && (
              <Typography
                sx={TYPOGRAPHY_STYLES.PACKAGE_TITLE}
                variant={'body2'}
              >
                {packageTitle[plan.planType]}
              </Typography>
            )}
            {plan.packages.map((pkg, idx) => (
              <Stack alignItems="flex-start" direction="row" gap={1} key={idx}>
                <Icon component={ICON_CHECKED} sx={ICON_STYLES.PACKAGE} />
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
