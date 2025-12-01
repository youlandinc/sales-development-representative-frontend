'use client';
import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import useSWR from 'swr';

import { SLUG_MAP } from '@/constants/directories';
import { useDirectoriesStore } from '@/stores/directories';
import { useShallow } from 'zustand/react/shallow';
import { _fetchDirectoriesInfo } from '@/request/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';

import { DirectoriesCard, DirectoriesCardSkeleton } from './index';

export const Directories: FC = () => {
  const router = useRouter();
  const { initializeDataFlow, isLoadingConfig } = useDirectoriesStore(
    useShallow((state) => ({
      initializeDataFlow: state.initializeDataFlow,
      isLoadingConfig: state.isLoadingConfig,
    })),
  );
  const [clickedBizId, setClickedBizId] = useState<DirectoriesBizIdEnum | null>(
    null,
  );

  const { data: directoriesData, isLoading } = useSWR(
    'fetchDirectoriesInfo',
    _fetchDirectoriesInfo,
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading) {
    return (
      <Stack gap={4.5}>
        <Stack gap={1}>
          <Typography lineHeight={1.2} variant={'h5'}>
            Directories
          </Typography>
          <Typography fontSize={14}>
            Your gateway to verified intelligence across capital markets, real
            estate, and global industries
          </Typography>
        </Stack>

        <Stack
          sx={{
            flexDirection: 'row',
            gap: 4.5,
            maxWidth: 1100,
            flexWrap: 'wrap',
          }}
        >
          <DirectoriesCardSkeleton isDark />
          <DirectoriesCardSkeleton />
        </Stack>
      </Stack>
    );
  }

  return (
    <Fade in>
      <Stack gap={4.5}>
        <Stack gap={1}>
          <Typography lineHeight={1.2} variant={'h5'}>
            Directories
          </Typography>
          <Typography fontSize={14}>
            Your gateway to verified intelligence across capital markets, real
            estate, and global industries
          </Typography>
        </Stack>

        <Stack
          sx={{
            flexDirection: 'row',
            gap: 4.5,
            maxWidth: 1100,
            flexWrap: 'wrap',
          }}
        >
          {directoriesData?.data.map((directory) => (
            <DirectoriesCard
              {...directory}
              buttonLoading={
                isLoadingConfig && clickedBizId === directory.bizId
              }
              key={directory.bizId}
              onButtonClick={async ({ bizId, isAuth }) => {
                if (isAuth) {
                  setClickedBizId(bizId);
                  const success = await initializeDataFlow(bizId);

                  if (success) {
                    return router.push(`/directories/${SLUG_MAP[bizId]}`);
                  }
                  setClickedBizId(null);
                }
                router.push(`/pricing?bizId=${bizId}`);
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Fade>
  );
};
