import { FC, ReactNode } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

import { PLANS_ROUTE } from '@/components/molecules/Layout/Layout.data';
import { DIRECTORIES_BADGE_AUTH } from '@/constants/directories';
import { useDirectoriesStore } from '@/stores/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';

type QueryTooltipAccessProps = {
  variant: 'access';
  open?: boolean;
};

type QueryTooltipInfoProps = {
  variant?: 'info';
  title?: ReactNode;
};

type QueryTooltipProps = {
  children: ReactNode;
} & (QueryTooltipAccessProps | QueryTooltipInfoProps);

const TOOLTIP_SX = {
  tooltip: {
    sx: {
      px: 0.75,
      py: 0.5,
      maxWidth: 180,
    },
  },
};

const QueryTooltipAccess: FC<{ children: ReactNode; open?: boolean }> = ({
  children,
  open,
}) => {
  const bizId = useDirectoriesStore(
    (state) => state.bizId,
  ) as DirectoriesBizIdEnum;

  const isControlled = open !== undefined;

  return (
    <Tooltip
      arrow
      disableFocusListener
      disableHoverListener={isControlled}
      open={isControlled ? open : undefined}
      placement={'top'}
      slotProps={TOOLTIP_SX}
      title={
        <Typography sx={{ fontSize: 12, lineHeight: 1.5, textAlign: 'center' }}>
          Available in the{' '}
          <Typography component="span" sx={{ fontSize: 12, fontWeight: 600 }}>
            {bizId ? DIRECTORIES_BADGE_AUTH[bizId]?.strong : 'Premium'}
          </Typography>{' '}
          plan.{' '}
          <Typography
            component="span"
            onClick={() =>
              window.open(`${PLANS_ROUTE}?bizId=${bizId}`, '_blank')
            }
            sx={{
              fontSize: 12,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Upgrade to access
          </Typography>
          .
        </Typography>
      }
    >
      <Box>{children}</Box>
    </Tooltip>
  );
};

const QueryTooltipInfo: FC<{ children: ReactNode; title?: ReactNode }> = ({
  children,
  title,
}) => {
  if (!title) {
    return <>{children}</>;
  }
  return (
    <Tooltip
      arrow
      disableFocusListener
      placement={'top'}
      slotProps={TOOLTIP_SX}
      title={title}
    >
      <Box>{children}</Box>
    </Tooltip>
  );
};

export const QueryTooltip: FC<QueryTooltipProps> = (props) => {
  const { children, variant = 'info' } = props;

  if (variant === 'access') {
    const { open } = props as QueryTooltipAccessProps;
    return <QueryTooltipAccess open={open}>{children}</QueryTooltipAccess>;
  }

  const { title } = props as QueryTooltipInfoProps;
  return <QueryTooltipInfo title={title}>{children}</QueryTooltipInfo>;
};
