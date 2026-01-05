import { FC } from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';

import { useDirectoriesStore } from '@/stores/directories';
import { DIRECTORIES_BADGE_AUTH } from '@/constants/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';

import {
  QUERY_TOOLTIP_SLOT_PROPS,
  QueryIcon,
  QueryTooltipAccessTitle,
} from './index';

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
      placement={'top'}
      slotProps={QUERY_TOOLTIP_SLOT_PROPS}
      title={<QueryTooltipAccessTitle />}
    >
      <Box>
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
          <QueryIcon.Lock />
          <Typography
            sx={{
              color: '#BC9166',
              fontSize: 10,
            }}
          >
            {DIRECTORIES_BADGE_AUTH[bizId].title}
          </Typography>
        </Stack>
      </Box>
    </Tooltip>
  );
};
