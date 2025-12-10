import { FC, ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface StyledTabButtonProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const StyledTabButton: FC<StyledTabButtonProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        border: '1px solid',
        borderColor: isActive ? 'text.default' : '#D0CEDA',
        borderRadius: 2,
        px: 2.5,
        py: 1,
        bgcolor: isActive ? '#F0F0F4' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        minHeight: 32,
        '&:hover': {
          bgcolor: isActive ? '#F0F0F4' : 'background.active',
        },
        '& svg': {
          path: {
            fill: isActive ? '#363440' : '#6F6C7D',
          },
        },
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={0.5}
        justifyContent={'center'}
      >
        {icon}
        <Typography fontSize={12} lineHeight={1.5}>
          {label}
        </Typography>
      </Stack>
    </Box>
  );
};
