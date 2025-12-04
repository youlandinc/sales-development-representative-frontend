import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { PaymentTypeEnum, PlanInfo } from '@/types/pricingPlan';

interface PriceDisplayProps {
  plan: PlanInfo;
  paymentType?: PaymentTypeEnum | string;
}

export const PriceDisplay: FC<PriceDisplayProps> = ({ plan, paymentType }) => {
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
