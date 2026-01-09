import { FC, ReactNode } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';

import { DrawersIconConfig } from '../index';

interface StyledActionItemProps {
  icon?: ReactNode;
  title: ReactNode;
  description: string;
  badges?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

export const StyledActionItem: FC<StyledActionItemProps> = ({
  icon,
  title,
  description,
  badges,
  onClick,
  loading = false,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          border: '1px solid',
          borderColor: '#F0F0F4',
          borderRadius: 2,
          p: 1.5,
        }}
      >
        <Stack gap={0.5}>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Skeleton
                height={16}
                sx={{ borderRadius: 1 }}
                variant={'rectangular'}
                width={16}
              />
              <Skeleton height={20} variant={'text'} width={120} />
            </Stack>
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Skeleton height={20} variant={'circular'} width={20} />
              <Skeleton height={20} variant={'circular'} width={20} />
              <Skeleton height={20} variant={'circular'} width={20} />
            </Stack>
          </Stack>
          <Skeleton height={18} variant={'text'} width={'80%'} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        border: '1px solid',
        borderColor: '#F0F0F4',
        borderRadius: 2,
        p: 1.5,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              borderColor: 'text.primary',
              '.arrow': {
                display: 'block',
              },
              '.badges': {
                display: 'none',
              },
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
          <Stack alignItems={'center'} flexDirection={'row'}>
            {badges && <Box className={'badges'}>{badges}</Box>}
            <DrawersIconConfig.Arrow
              className={'arrow'}
              size={16}
              sx={{
                display: 'none',
                transform: 'rotate(180deg)',
                '& path': {
                  fill: '#343330',
                },
              }}
            />
          </Stack>
        </Stack>
        <Typography color={'text.secondary'} fontSize={12} lineHeight={1.5}>
          {description}
        </Typography>
      </Stack>
    </Box>
  );
};
