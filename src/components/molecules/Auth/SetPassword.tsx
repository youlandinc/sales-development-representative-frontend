'use client';
import { useState } from 'react';
import { Stack, Typography } from '@mui/material';

import { StyledButton, StyledTextFieldPassword } from '@/components/atoms';

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
      ></Stack>
    </Stack>
  );
};
