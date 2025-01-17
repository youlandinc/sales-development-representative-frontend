import { FC, ReactNode, useEffect } from 'react';
import { Box, Stack, SxProps } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { useUserStore } from '@/provides';

import { CampaignProcess, LayoutSide } from '@/components/molecules';

export interface StyledLayoutProps {
  sx?: SxProps;
  children?: ReactNode;
}

export const Layout: FC<StyledLayoutProps> = ({ sx, children }) => {
  const router = useRouter();
  const { isHydration, accessToken } = useUserStore((state) => state);

  useEffect(
    () => {
      if (isHydration) {
        if (!accessToken) {
          return router.push('/auth/sign-in');
        }
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
        ...sx,
      }}
    >
      <Stack flexDirection={'row'} height={'100%'} width={'100%'}>
        <LayoutSide />
        <Stack
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            m: 0,
            pt: 7,
            px: 3,
            pb: 3,
            overflow: 'auto',
            minWidth: 720,
          }}
        >
          {children}
        </Stack>
      </Stack>

      <CampaignProcess />
    </Box>
  );
};
