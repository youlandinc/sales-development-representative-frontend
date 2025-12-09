import { FC, ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface StyledActionItemProps {
  icon?: ReactNode;
  title: string;
  description: string;
  badges?: ReactNode;
  onClick?: () => void;
}

export const StyledActionItem: FC<StyledActionItemProps> = ({
  icon,
  title,
  description,
  badges,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: '1px solid',
        borderColor: '#F0F0F4',
        borderRadius: 2,
        px: 1.5,
        py: 1,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              bgcolor: 'background.active',
            }
          : {},
      }}
    >
      <Stack gap={0.5}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
            {icon}
            <Typography fontSize={14} lineHeight={1.4}>
              {title}
            </Typography>
          </Stack>
          {badges}
        </Stack>
        <Typography color={'text.secondary'} fontSize={12} lineHeight={1.5}>
          {description}
        </Typography>
      </Stack>
    </Box>
  );
};
