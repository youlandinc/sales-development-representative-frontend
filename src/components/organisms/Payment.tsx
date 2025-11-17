import { Box, Stack } from '@mui/material';

import {
  PaymentForm,
  SubscriptionSummary,
} from '@/components/molecules/Payment';

export const Payment = () => {
  return (
    <Stack
      direction={'row'}
      gap={20}
      height={'100vh'}
      justifyContent={'space-between'}
      maxWidth={920}
      mx={'auto'}
      sx={{
        '&::before': {
          animationFillMode: 'both',
          background: 'var(--checkout-white)',
          content: '" "',
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          transformOrigin: 'right',
          width: '50%',
          boxShadow: '15px 0 30px 0 rgba(0,0,0,0.18)',
        },
      }}
    >
      <SubscriptionSummary />
      <PaymentForm />
    </Stack>
  );
};
