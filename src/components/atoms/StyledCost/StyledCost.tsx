import { Icon, Stack, StackProps, Typography } from '@mui/material';
import { FC } from 'react';

import ICON_COINS from './assets/icon_coins.svg';

type StyledCostProps = StackProps & {
  count: string;
  textColor?: string;
};

export const StyledCost: FC<StyledCostProps> = ({
  count,
  textColor,
  ...rest
}) => {
  return (
    <Stack
      alignItems={'center'}
      borderRadius={1}
      flexDirection={'row'}
      gap={0.5}
      px={1}
      py={0.5}
      {...rest}
    >
      <Icon component={ICON_COINS} sx={{ width: 16, height: 16 }} />
      <Typography color={textColor || '#866BFB'} variant={'body3'}>
        {count} / row
      </Typography>
    </Stack>
  );
};
