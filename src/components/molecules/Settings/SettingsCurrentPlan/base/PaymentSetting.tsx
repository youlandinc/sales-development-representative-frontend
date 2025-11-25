import { Box, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { SDRToast, StyledButton } from '@/components/atoms';
import { useAsyncFn } from '@/hooks';
import { _fetchPaymentPortal } from '@/request/settings/currentPlan';

import { BASE_URL } from '@/constants';

const RETURN_URL = `${BASE_URL}/settings`;

export const PaymentSetting: FC = () => {
  const [state, fetchPaymentPortal] = useAsyncFn(async () => {
    try {
      const { data } = await _fetchPaymentPortal(RETURN_URL);
      window.location.href = data;
    } catch (error) {
      const { message, header, variant } = error as HttpError;
      SDRToast({
        message,
        header,
        variant,
      });
    }
  }, []);
  return (
    <Box
      sx={{
        bgcolor: 'white',
        border: '1px solid #E5E5E5',
        borderRadius: 2,
        p: 3,
        width: '100%',
      }}
    >
      <Stack
        alignItems="flex-start"
        direction="row"
        justifyContent="space-between"
        sx={{ pr: 2 }}
      >
        <Stack gap={0.5}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: '#363440',
              lineHeight: 1.2,
            }}
          >
            Payment settings
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              color: '#6F6C7D',
              lineHeight: 1.5,
            }}
          >
            You&apos;ll be redirected to Stripe to update cards, billing info,
            and invoices.
          </Typography>
        </Stack>
        <StyledButton
          loading={state.loading}
          onClick={() => {
            fetchPaymentPortal();
          }}
          size="small"
          sx={{
            height: 32,
            px: 1.5,
            py: 0.75,
            fontSize: 12,
            width: 125,
          }}
          variant="outlined"
        >
          Manage payment
        </StyledButton>
      </Stack>
    </Box>
  );
};
