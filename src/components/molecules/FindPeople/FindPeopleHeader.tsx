import { Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import ICON_BACK from './assets/icon-back.svg';
import ICON_CLOSE from './assets/icon-close.svg';

export const FindPeopleHeader = () => {
  const router = useRouter();
  return (
    <Stack
      alignItems={'center'}
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      px={3}
      py={1.5}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={3}>
        <Icon
          component={ICON_BACK}
          onClick={() => {
            router.push('/prospect-enrich');
          }}
          sx={{ width: 20, height: 20, mt: 0.25, cursor: 'pointer' }}
        />
        <Typography fontWeight={600} lineHeight={1.2}>
          Find people
        </Typography>
      </Stack>
      <Icon
        component={ICON_CLOSE}
        sx={{ width: 20, height: 20, mt: 0.25, cursor: 'pointer' }}
      />
    </Stack>
  );
};
