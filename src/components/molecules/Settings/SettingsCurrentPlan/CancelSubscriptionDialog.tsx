import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { StyledButton, StyledDialog } from '@/components/atoms';

import { Close } from '@mui/icons-material';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  endDate: string;
}

export const CancelSubscriptionDialog: FC<CancelSubscriptionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  planName,
  endDate,
}) => {
  return (
    <StyledDialog
      content={
        <Stack gap={1.5} sx={{ py: 2.25 }}>
          {/* Description */}
          <Typography variant={'body2'}>
            Your subscription will stay active until the end of this billing
            period.
            <br />
            You&apos;ll lose access after that date.
          </Typography>

          {/* Plan details */}
          <Stack gap={1}>
            <Stack alignItems="flex-start" direction="row" gap={1}>
              <Typography variant={'subtitle2'}>Current plan:</Typography>
              <Typography variant={'body2'}>{planName}</Typography>
            </Stack>

            <Stack alignItems="flex-start" direction="row" gap={1}>
              <Typography variant={'subtitle2'}>End on:</Typography>
              <Typography variant={'body2'}>{endDate}</Typography>
            </Stack>
          </Stack>
        </Stack>
      }
      footer={
        <Stack direction="row" gap={1} justifyContent="flex-end">
          <StyledButton onClick={onClose} size={'medium'} variant={'outlined'}>
            Keep subscription
          </StyledButton>
          <StyledButton onClick={onConfirm} size={'medium'}>
            Confirm cancellation
          </StyledButton>
        </Stack>
      }
      header={
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Are you sure you want to cancel?
          </Typography>
          <Close onClick={onClose} sx={{ fontSize: 24, cursor: 'pointer' }} />
        </Stack>
      }
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          width: 552,
          p: 0,
        },
      }}
    />
  );
};
