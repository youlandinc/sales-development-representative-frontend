import { FC } from 'react';
import { Icon, Stack } from '@mui/material';

import { LayoutUserInfo } from './index';

import ICON_LOGO_EXPEND from './assets/icon_logo_expend.svg';
import { PlansRouteButton } from './base';

export const LayoutHeader: FC = () => {
  return (
    <Stack
      alignItems={'center'}
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      height={54}
      px={4}
      width={'100%'}
    >
      <Icon
        component={ICON_LOGO_EXPEND}
        sx={{
          ml: 0.25,
          height: 32,
          width: 141,
        }}
      />
      <Stack flexDirection={'row'} gap={3} ml={'auto'}>
        <PlansRouteButton />
        <LayoutUserInfo />
      </Stack>
    </Stack>
  );
};
