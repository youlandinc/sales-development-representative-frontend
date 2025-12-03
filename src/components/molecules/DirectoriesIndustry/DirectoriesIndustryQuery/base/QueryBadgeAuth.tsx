import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useDirectoriesStore } from '@/stores/directories';
import { DIRECTORIES_BADGE_AUTH } from '@/constants/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';

import { QueryTooltip } from './index';

import ICON_LOCK from './assets/icon-lock.svg';

export const QueryBadgeAuth: FC = () => {
  const bizId = useDirectoriesStore(
    (state) => state.bizId,
  ) as DirectoriesBizIdEnum;

  if (!bizId) {
    return null;
  }

  return (
    <QueryTooltip variant={'access'}>
      <Stack
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        sx={{
          flexDirection: 'row',
          gap: 0.25,
          alignItems: 'center',
          px: 0.75,
          py: 0.25,
          borderRadius: 1,
          border: '1px solid #C49F61',
          cursor: 'default',
        }}
      >
        <Icon component={ICON_LOCK} sx={{ width: 11, height: 11 }} />
        <Typography
          sx={{
            color: '#BC9166',
            fontSize: 10,
          }}
        >
          {DIRECTORIES_BADGE_AUTH[bizId].title}
        </Typography>
      </Stack>
    </QueryTooltip>
  );
};
