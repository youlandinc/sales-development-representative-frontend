'use client';
import { customToast } from '@/components/atoms/StyledToast';
import { Container } from '@mui/material';

import { StyledButton, ToastContainerProvider } from '@/components/atoms';
import { EnumHttpVariantType } from '@/types/enum';

export const fetchCache = 'force-no-store';

const ToastPage = () => {
  return (
    <Container>
      <ToastContainerProvider />
      <StyledButton
        onClick={() => {
          customToast(
            'Hello, world! This is a toast message.',
            undefined,
            'This is a description.',
          );
        }}
      >
        toast
      </StyledButton>
      <StyledButton
        onClick={() => {
          customToast(
            'Hello, world! This is a toast message.',
            EnumHttpVariantType.success,
            'This is a description.',
          );
        }}
      >
        success
      </StyledButton>
      <StyledButton
        onClick={() => {
          customToast(
            'Hello, world! This is a toast message.',
            EnumHttpVariantType.error,
            'Hello, world! This is a toast message.',
          );
        }}
      >
        error
      </StyledButton>
    </Container>
  );
};

export default ToastPage;
