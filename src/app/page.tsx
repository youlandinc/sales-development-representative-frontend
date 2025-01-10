'use client';
import { Container, Stack } from '@mui/material';

import { ToastProvider } from '@/provides/ToastProvider';
import { StyledButton } from '@/components/atoms';
import { customToast } from '@/components/atoms';

import { HttpVariantEnum } from '@/types';

export default function Home() {
  return (
    <Container>
      <ToastProvider />
      <Stack flexDirection={'row'} gap={3} py={3}>
        <StyledButton
          onClick={() => {
            customToast(
              'Hello, world! This is a toast message.',
              undefined,
              'This is a description.',
            );
          }}
        >
          toast info
        </StyledButton>
        <StyledButton
          onClick={() => {
            customToast(
              'Hello, world! This is a toast message.',
              HttpVariantEnum.success,
              'This is a description.',
            );
          }}
        >
          toast success
        </StyledButton>
        <StyledButton
          onClick={() => {
            customToast(
              'Hello, world! This is a toast message.',
              HttpVariantEnum.error,
              'Hello, world! This is a toast message.',
            );
          }}
        >
          toast error
        </StyledButton>
      </Stack>
    </Container>
  );
}
