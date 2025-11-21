import { Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

interface StyledFormElementContainerProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

export const StyledFormElementContainer: FC<
  PropsWithChildren<StyledFormElementContainerProps>
> = ({ label, children, required }) => {
  return (
    <Stack sx={{ flex: 1, flexDirection: 'column', gap: 0.5 }}>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 400,
          color: '#202939',
          lineHeight: 1.4,
        }}
      >
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      {children}
    </Stack>
  );
};
