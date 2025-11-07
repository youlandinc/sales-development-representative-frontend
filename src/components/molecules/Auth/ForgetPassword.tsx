'use client';
import { Box, Stack, Typography } from '@mui/material';

import { StyledButton, StyledTextField } from '@/components/atoms';

import { LOGO_HEIGHT, SignLogo } from './SignLogo';
import { useForgetPassword } from './hooks';

export const ForgetPassword = () => {
  const { loading, email, setEmail, onClickBack, onClickNext } =
    useForgetPassword();

  return (
    <Box bgcolor={'#FBFCFD'}>
      <SignLogo />
      <Stack
        alignItems={'center'}
        height={`calc(100vh - ${LOGO_HEIGHT}px)`}
        justifyContent={'center'}
        width={'100%'}
      >
        <Stack
          bgcolor={'#ffffff'}
          border={'1px solid #E5E5E5'}
          borderRadius={4}
          component={'form'}
          gap={6}
          maxWidth={600}
          onSubmit={async (e) => {
            e.preventDefault();
            await onClickNext();
          }}
          px={5}
          py={7.5}
          width={'100%'}
        >
          <Stack>
            <Typography
              color={'#202939'}
              fontSize={'24px'}
              lineHeight={1.2}
              textAlign={'center'}
              variant={'h5'}
            >
              Forgot password
            </Typography>
            <Typography
              color={'#9095A3'}
              mt={1}
              textAlign={'center'}
              variant={'body2'}
            >
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </Typography>
          </Stack>
          <Stack gap={3}>
            <StyledTextField
              disabled={loading}
              label={'Email'}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder={'Email'}
              required
              size={'large'}
              value={email}
            />

            <StyledButton disabled={!email} loading={loading} type={'submit'}>
              Next
            </StyledButton>
            <StyledButton
              color={'info'}
              disabled={loading}
              onClick={onClickBack}
              sx={{
                borderColor: '#DFDEE6 !important',
              }}
              variant={'outlined'}
            >
              Back
            </StyledButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
