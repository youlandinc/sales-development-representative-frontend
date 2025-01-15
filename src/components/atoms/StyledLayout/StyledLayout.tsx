import { FC, ReactNode } from 'react';
import { Box, Container, Stack, SxProps } from '@mui/material';
import { StyledLayoutSide } from '@/components/atoms/StyledLayout/StyledLayoutSide';

export interface StyledLayoutProps {
  sx?: SxProps;
  children?: ReactNode;
}

export const StyledLayout: FC<StyledLayoutProps> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        height: '100vh',
        width: '100vw',
        ...sx,
      }}
    >
      <Stack flexDirection={'row'}>
        <StyledLayoutSide />
        <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </Container>
      </Stack>
    </Box>
  );
};
