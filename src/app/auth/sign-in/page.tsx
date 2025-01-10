'use client';
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Container, Stack } from '@mui/material';

import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

import {
  StyledButton,
  StyledCheckbox,
  StyledInputOTP,
  StyledInputOTPGroup,
  StyledInputOTPSlot,
  StyledTextField,
} from '@/components/atoms';

const SignIn = () => {
  const [otp, setOtp] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [textField, setTextField] = useState('');

  return (
    <Container>
      I am sign in
      <Stack>
        <StyledInputOTP
          maxLength={4}
          onChange={(e) => {
            setOtp(e);
          }}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={otp}
        >
          <StyledInputOTPGroup>
            <StyledInputOTPSlot index={0} />
            <StyledInputOTPSlot index={1} />
            <StyledInputOTPSlot index={2} />
            <StyledInputOTPSlot index={3} />
          </StyledInputOTPGroup>
        </StyledInputOTP>
      </Stack>
      <Stack>
        <StyledCheckbox
          checked={checkbox}
          label={'I am checkbox'}
          onChange={(e, v) => {
            setCheckbox(v);
          }}
        />
      </Stack>
      <Stack>
        <StyledTextField
          onChange={(e) => setTextField(e.target.value)}
          value={textField}
        />
      </Stack>
      <Stack>
        <StyledButton>I am button</StyledButton>
      </Stack>
    </Container>
  );
};

export default SignIn;
