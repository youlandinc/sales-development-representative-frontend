import { FC } from 'react';
import { Typography } from '@mui/material';

import { DIRECTORIES_BADGE_AUTH } from '@/constants/directories';
import { useDirectoriesStore } from '@/stores/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';

import { PLANS_ROUTE } from '@/components/molecules/Layout/Layout.data';

export const QUERY_TOOLTIP_SLOT_PROPS = {
  tooltip: {
    sx: {
      bgcolor: 'rgba(97, 97, 97, 0.92)',
      maxWidth: 210,
      py: 1,
      px: 1.5,
    },
  },
  arrow: {
    sx: {
      color: 'rgba(97, 97, 97, 0.92)',
    },
  },
};

export const QueryTooltipAccessTitle: FC = () => {
  const bizId = useDirectoriesStore(
    (state) => state.bizId,
  ) as DirectoriesBizIdEnum;

  return (
    <Typography sx={{ fontSize: 12, lineHeight: 1.5, textAlign: 'center' }}>
      Available in the{' '}
      <Typography component="span" sx={{ fontSize: 12, fontWeight: 600 }}>
        {bizId ? DIRECTORIES_BADGE_AUTH[bizId]?.strong : 'Premium'}
      </Typography>{' '}
      plan.{' '}
      <Typography
        component={'span'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          window.open(`${PLANS_ROUTE}?bizId=${bizId}`, '_blank');
        }}
        sx={{
          fontSize: 12,
          color: 'inherit',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        Upgrade to access
      </Typography>
      .
    </Typography>
  );
};
