'use client';

import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import useSWR from 'swr';

import { _fetchDirectoriesInfo } from '@/request/directories';
import { useDirectoriesStore } from '@/stores/directories';

import { DirectoriesCard } from './index';
import { SLUG_MAP } from '@/constants/directories';

export const Directories: FC = () => {
  const router = useRouter();
  const { fetchDefaultViaBiz, loadingConfig } = useDirectoriesStore();

  const { data: directoriesData, isLoading } = useSWR(
    'fetchDirectoriesInfo',
    _fetchDirectoriesInfo,
  );

  if (isLoading) {
    return (
      <Stack gap="48px" sx={{ padding: '48px' }}>
        <Typography>Loading directories...</Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={6}>
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
          gap: 6,
          maxWidth: 1100,
          flexWrap: 'wrap',
        }}
      >
        {directoriesData?.data.map((directory) => (
          <DirectoriesCard
            {...directory}
            key={directory.bizId}
            onButtonClick={async ({ bizId, isAuth }) => {
              if (isAuth) {
                // 预加载配置
                const success = await fetchDefaultViaBiz(bizId);
                
                if (success) {
                  // 成功后跳转
                  router.push(`/directories/${SLUG_MAP[bizId]}`);
                }
              }
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};
