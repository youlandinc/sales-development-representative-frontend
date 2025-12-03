import { Icon, Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { useSwitch } from '@/hooks';

import ICON_ARROW from './assets/icon_collapse.svg';

interface CollapseCardProps {
  title: string;
  defaultOpen?: boolean;
}

export const CollapseCard: FC<PropsWithChildren<CollapseCardProps>> = ({
  title,
  children,
  defaultOpen,
}) => {
  const { visible, toggle } = useSwitch(defaultOpen);

  return (
    <Stack border={'1px solid #ccc'} borderRadius={2} gap={1.5} p={1.5}>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        onClick={toggle}
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Typography fontWeight={600} variant={'subtitle1'}>
          {title}
        </Typography>
        <Icon
          component={ICON_ARROW}
          sx={{
            width: 16,
            height: 16,
            transform: visible ? 'none' : 'rotate(180deg)',
            transition: 'transform 0.2s',
          }}
        />
      </Stack>
      {visible && children}
    </Stack>
  );
};
