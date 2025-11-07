'use client';
import { Box, Stack, Typography } from '@mui/material';

import { StyledButton, StyledTextFieldPassword } from '@/components/atoms';

import { LOGO_HEIGHT, SignLogo } from './SignLogo';
import { useSetPassword } from './hooks';
import { SignPassWordCheck } from './SignPassWordCheck';

export const SetPassword = () => {
  const {
    password,
    setPassword,
    passwordError,
    onClickSetPassword,
    loading,
    isDisabled,
  } = useSetPassword();

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
            await onClickSetPassword();
          }}
          px={5}
          py={7.5}
          width={'100%'}
        >
          <Typography
            color={'#202939'}
            fontSize={'32px'}
            textAlign={'center'}
            variant={'h5'}
          >
            Set password
          </Typography>
          <Stack gap={3}>
            <Stack gap={1}>
              <StyledTextFieldPassword
                disabled={loading}
                label={'New password'}
                onChange={(e) => setPassword(e.target.value.trim())}
                required
                size={'large'}
                value={password}
              />
              <SignPassWordCheck
                password={password}
                passwordError={passwordError}
              />
            </Stack>
            <StyledButton
              disabled={loading || isDisabled}
              loading={loading}
              type={'submit'}
            >
              Set password
            </StyledButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
