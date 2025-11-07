import { Box, Stack, Typography } from '@mui/material';

import {
  StyledButton,
  StyledDialog,
  StyledOTP,
  StyledOTPGroup,
  StyledOTPSlot,
} from '@/components/atoms';

interface SignUpDialogProps {
  email: string;
  loading: boolean;
  visible: boolean;
  seconds: number;
  otp: string;
  close: () => void;
  onClickResendOtp: () => void;
  setOtp: (v: string) => void;
  handledVerifyOtp: (verifyCode: string) => void;
}

export const SignUpDialog = ({
  email,
  loading,
  visible,
  close,
  onClickResendOtp,
  seconds,
  otp,
  setOtp,
  handledVerifyOtp,
}: SignUpDialogProps) => {
  return (
    <StyledDialog
      content={
        <Box>
          <Typography
            color={'#9095A3'}
            component={'div'}
            fontSize={'14px'}
            fontWeight={400}
            lineHeight={1.5}
            textAlign={'left'}
            variant={'subtitle1'}
            width={'100%'}
          >
            We&apos;ve sent a code to{' '}
            <Typography component={'span'} variant={'subtitle2'}>
              {email}
            </Typography>
          </Typography>
          <Stack
            alignItems={'center'}
            direction={'row'}
            justifyContent={'center'}
            my={3}
          >
            <StyledOTP
              autoFocus
              disabled={loading}
              maxLength={4}
              onChange={(v) => {
                setOtp(v);
                if (v.length === 4 && !loading) {
                  handledVerifyOtp(v);
                }
              }}
              value={otp}
            >
              <StyledOTPGroup>
                <StyledOTPSlot index={0} />
                <StyledOTPSlot index={1} />
                <StyledOTPSlot index={2} />
                <StyledOTPSlot index={3} />
              </StyledOTPGroup>
            </StyledOTP>
          </Stack>
          {seconds > 59 ? (
            <Typography
              color={'#9095A3'}
              component={'div'}
              fontSize={'14px'}
              fontWeight={400}
              lineHeight={1.5}
              textAlign={'center'}
              variant={'subtitle1'}
              width={'100%'}
            >
              Didn&apos;t get a code?{' '}
              <Typography
                color={'#6E4EFB'}
                component={'span'}
                onClick={onClickResendOtp}
                sx={{ cursor: 'pointer' }}
                variant={'subtitle2'}
              >
                Click to resend
              </Typography>
            </Typography>
          ) : (
            <Typography
              color={'#9095A3'}
              fontSize={'14px'}
              fontWeight={400}
              lineHeight={1.5}
              textAlign={'center'}
              variant={'subtitle2'}
              width={'100%'}
            >
              You can resend in {seconds} seconds
            </Typography>
          )}
        </Box>
      }
      disableEscapeKeyDown
      footer={
        <Box mt={3}>
          <StyledButton
            color={'info'}
            disabled={loading}
            loading={loading}
            onClick={close}
            size={'small'}
            sx={{ mr: 1, width: '70px' }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
        </Box>
      }
      header={
        <Typography
          color="#202939"
          fontSize={'18px'}
          fontWeight={600}
          lineHeight={'28px'}
        >
          Enter verification code
        </Typography>
      }
      onClose={(e, reason) => {
        if (reason !== 'backdropClick') {
          close();
        }
      }}
      open={visible}
      sx={{
        '&.MuiDialog-root': {
          '& .MuiPaper-root': {
            maxWidth: 600,
          },
        },
      }}
    />
  );
};
