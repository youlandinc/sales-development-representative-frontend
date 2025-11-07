import { Icon, Stack } from '@mui/material';

import COREPASS_LOGO from './assets/corepass-logo.svg';

export const LOGO_HEIGHT = 72;

export const SignLogo = () => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      height={LOGO_HEIGHT}
      m={'0 auto'}
      px={'80px'}
      width={{
        xxl: '1440px',
      }}
    >
      <Icon
        component={COREPASS_LOGO}
        style={{
          width: '141px',
          height: '24px',
        }}
      />
    </Stack>
  );
};
