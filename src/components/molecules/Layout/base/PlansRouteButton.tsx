import { Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import ICON_COINS from '../assets/icon_coins.svg';

export const PlansRouteButton = () => {
  const router = useRouter();

  const onClickToViewPlans = () => {
    router.push('/plans');
  };

  return (
    <Stack
      alignItems={'center'}
      direction={'row'}
      gap={0.5}
      onClick={onClickToViewPlans}
      sx={{
        cursor: 'pointer',
        p: 0.5,
        borderRadius: 2,
        '&:hover': {
          bgcolor: '#F4F5F9',
        },
      }}
    >
      <Icon
        component={ICON_COINS}
        sx={{
          width: 16,
          height: 16,
        }}
      />
      <Typography
        className={'plans_label'}
        sx={{
          fontSize: 12,
          fontWeight: 400,
          lineHeight: 1.5,
          color: '#363440',
        }}
      >
        View plans
      </Typography>
    </Stack>
  );
};
