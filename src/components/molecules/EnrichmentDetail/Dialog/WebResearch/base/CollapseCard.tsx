import { Icon, Stack, SxProps, Typography } from '@mui/material';
import { FC, PropsWithChildren, useMemo } from 'react';

import { useSwitch } from '@/hooks';

import ICON_ARROW from '@/components/molecules/EnrichmentDetail/Dialog/WebResearch/assets/icon_collapse.svg';

interface CollapseCardProps {
  title: string;
  defaultOpen?: boolean;
  hasCollapse?: boolean;
}

export const CollapseCard: FC<PropsWithChildren<CollapseCardProps>> = ({
  title,
  children,
  defaultOpen,
  hasCollapse = true,
}) => {
  const { visible, toggle } = useSwitch(!hasCollapse ? true : defaultOpen);

  const headerSx = useMemo<SxProps>(
    () => ({
      cursor: hasCollapse ? 'pointer' : 'default',
      userSelect: 'none',
    }),
    [hasCollapse],
  );

  const iconSx = useMemo<SxProps>(
    () => ({
      width: 16,
      height: 16,
      transform: visible ? 'none' : 'rotate(-90deg)',
      transitionDuration: '.3s',
    }),
    [visible],
  );

  return (
    <Stack border={'1px solid #F0F0F4'} borderRadius={2} gap={1.5} p={1.5}>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        onClick={hasCollapse ? toggle : undefined}
        sx={headerSx}
      >
        <Typography fontWeight={600} variant={'body2'}>
          {title}
        </Typography>
        {hasCollapse && <Icon component={ICON_ARROW} sx={iconSx} />}
      </Stack>
      {visible && children}
    </Stack>
  );
};
