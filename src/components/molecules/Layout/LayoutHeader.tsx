import { FC } from 'react';
import { Icon, Stack } from '@mui/material';

import { LayoutUserInfo } from './index';

import ICON_LOGO_EXPEND from './assets/icon_logo_expend.svg';

export const LayoutHeader: FC = () => {
  return (
    <Stack
      alignItems={'center'}
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      height={72}
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

      <Stack ml={'auto'}>
        <LayoutUserInfo />
      </Stack>
    </Stack>
  );
};
