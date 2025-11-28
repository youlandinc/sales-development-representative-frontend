import { FC } from 'react';
import { Icon, Stack, Tooltip, Typography } from '@mui/material';

import { useDirectoriesStore } from '@/stores/directories';
import { DIRECTORIES_BADGE_AUTH } from '@/constants/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';

import ICON_LOCK from './assets/icon-lock.svg';

export const QueryBadgeAuth: FC = () => {
  const bizId = useDirectoriesStore(
    (state) => state.bizId,
  ) as DirectoriesBizIdEnum;

  if (!bizId) {
    return null;
  }

  return (
    <Tooltip
      arrow
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      placement={'top'}
      slotProps={{
        tooltip: {
          sx: {
            px: 0.75,
            py: 0.5,
            maxWidth: 200,
          },
        },
      }}
      title={
        <Typography sx={{ fontSize: 12, lineHeight: 1.5, textAlign: 'center' }}>
          Available in the{' '}
          <Typography
            component={'span'}
            sx={{
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {DIRECTORIES_BADGE_AUTH[bizId].strong}
          </Typography>{' '}
          plan. Upgrade to access.
        </Typography>
      }
    >
      <Stack
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
    </Tooltip>
  );
};
