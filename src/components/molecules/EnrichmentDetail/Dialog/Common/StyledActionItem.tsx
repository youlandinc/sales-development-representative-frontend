import { FC, ReactNode } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import ICON_ARROW from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_arrow.svg';

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
            <Icon
              className={'arrow'}
              component={ICON_ARROW}
              sx={{
                width: 16,
                height: 16,
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
