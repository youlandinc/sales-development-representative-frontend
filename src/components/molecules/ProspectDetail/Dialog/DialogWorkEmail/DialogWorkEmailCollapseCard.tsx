import { Collapse, Icon, Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';

import { useSwitch } from '@/hooks';

import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';

export const DialogWorkEmailCollapseCard: FC<
  PropsWithChildren & { title: string | ReactNode }
> = ({ children, title }) => {
  const { visible, toggle } = useSwitch(true);
  return (
    <Stack
      border={'1px solid #DFDEE6'}
      borderRadius={2}
      gap={visible ? 1 : 0}
      p={1.5}
      sx={{
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        onClick={toggle}
        sx={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <Typography variant={'subtitle2'}>{title}</Typography>
        <Icon
          component={ICON_ARROW}
          sx={{
            width: 16,
            height: 16,
            transform: visible ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Stack>
      <Collapse in={visible} timeout={300}>
        {children}
      </Collapse>
    </Stack>
  );
};
