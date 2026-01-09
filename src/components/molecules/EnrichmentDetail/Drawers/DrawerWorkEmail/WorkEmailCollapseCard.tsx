import { Collapse, Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';

import { useSwitch } from '@/hooks';

import { DrawersIconConfig } from '../DrawersIconConfig';

export const WorkEmailCollapseCard: FC<
  PropsWithChildren & { title: string | ReactNode }
> = ({ children, title }) => {
  const { visible, toggle } = useSwitch(true);
  return (
    <Stack
      border={'1px solid #DFDEE6'}
      borderRadius={2}
      gap={visible ? 1.5 : 0}
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
        <DrawersIconConfig.ArrowDown
          size={16}
          sx={{
            transform: visible ? 'rotate(0deg)' : 'rotate(-90deg)',
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
