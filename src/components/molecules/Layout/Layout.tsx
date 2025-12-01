import { FC, ReactNode, useEffect } from 'react';
import { Box, Stack, SxProps } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { useUserStore } from '@/providers';

import { LayoutHeader, LayoutSide } from '@/components/molecules';
import { useCurrentPlanStore } from '@/stores/useCurrentPlanStore';

export interface StyledLayoutProps {
  sx?: SxProps;
  children?: ReactNode;
  contentSx?: SxProps;
}

export const Layout: FC<StyledLayoutProps> = ({ sx, children, contentSx }) => {
  const router = useRouter();
  const { isHydration, accessToken } = useUserStore((state) => state);
  const fetchCurrentPlan = useCurrentPlanStore(
    (state) => state.fetchCurrentPlan,
  );

  useEffect(
    () => {
      if (isHydration) {
        if (!accessToken) {
          return router.push('/auth/sign-in');
        }
        fetchCurrentPlan();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, isHydration],
  );

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        height: '100vh',
        width: '100vw',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <LayoutHeader />
      <Stack flexDirection={'row'} height={'calc(100% - 54px)'} width={'100%'}>
        <LayoutSide />
        <Stack
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            m: 0,
            p: 3,
            overflow: 'auto',
            minWidth: 720,
            ...contentSx,
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Box>
  );
};
