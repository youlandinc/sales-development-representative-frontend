'use client';

import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import useSWR from 'swr';

import { _fetchDirectoriesInfo } from '@/request/directories';

import { DirectoriesCard } from './index';
import { DirectoriesBizIdEnum } from '@/types/Directories';

const DirectoriesBizIdHash = {
  [DirectoriesBizIdEnum.capital_markets]: 'capital_markets',
  [DirectoriesBizIdEnum.real_estate_lending]: 'real_estate_lending',
  [DirectoriesBizIdEnum.business_corporate]: 'business_corporate',
};

export const Directories: FC = () => {
  const router = useRouter();

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
            onButtonClick={({ bizId, isAuth }) => {
              if (isAuth) {
                console.log(123);
                router.push(`/directories/${DirectoriesBizIdHash[bizId]}`);
              }
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};
