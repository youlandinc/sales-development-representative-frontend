'use client';
import { Stack, Typography } from '@mui/material';

import {
  StyledButton,
  StyledCheckbox,
  StyledTextField,
} from '@/components/atoms';

export const SignIn = () => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#FBFCFD'}
      height={'100vh'}
      justifyContent={'center'}
      width={'100%'}
    >
      <Stack
        bgcolor={'#ffffff'}
        border={'1px solid #E5E5E5'}
        borderRadius={4}
        gap={6}
        maxWidth={600}
        px={5}
        py={7.5}
        width={'100%'}
      >
        <Stack>
          <Typography textAlign={'center'} variant={'h5'}>
            Welcome back
          </Typography>
          <Typography
            color={'text.secondary'}
            textAlign={'center'}
            variant={'body2'}
          >
            Log in by entering your email below
          </Typography>
        </Stack>

        <Stack gap={3}>
          <StyledTextField label={'Email'} />
          <StyledTextField label={'Password'} />

          <Stack flexDirection={'row'}>
            <StyledCheckbox
              label={
                <Typography color={'text.secondary'} ml={1} variant={'body2'}>
                  Remember me
                </Typography>
              }
            />
            <Typography
              color={'text.secondary'}
              ml={'auto'}
              sx={{ cursor: 'pointer' }}
              variant={'body2'}
            >
              Forgot password?
            </Typography>
          </Stack>

          <StyledButton>Log in</StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
