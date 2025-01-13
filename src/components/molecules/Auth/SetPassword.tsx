import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

export const SetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        <Typography textAlign={'center'} variant={'h5'}>
          Set password
        </Typography>
        <Stack gap={3}>
          <StyledTextFieldPassword
            label={'New password'}
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
          />
          <StyledTextFieldPassword
            label={'Confirm password'}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <StyledTextField label={'New password'} />
          <StyledTextField label={'Confirm password'} />

          <StyledButton>Set password</StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
