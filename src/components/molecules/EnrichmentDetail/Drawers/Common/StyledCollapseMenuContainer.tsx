import { FC, PropsWithChildren, ReactNode } from 'react';
import { Collapse, Stack, Typography } from '@mui/material';

import { useSwitch } from '@/hooks';

import { DrawersIconConfig } from '../DrawersIconConfig';

interface StyledCollapseMenuContainerProps {
  icon?: ReactNode;
  title: ReactNode;
  gap?: number;
}
export const StyledCollapseMenuContainer: FC<
  PropsWithChildren<StyledCollapseMenuContainerProps>
> = ({ children, icon, title, gap = 1.5 }) => {
  const { visible, toggle } = useSwitch(true);

  return (
    <Stack gap={visible ? gap : 0} sx={{ transition: 'all .3s' }}>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        onClick={toggle}
        sx={{
          cursor: 'pointer',
          height: '24px',
        }}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={0.5}
          justifyContent={'space-between'}
        >
          {icon && icon}
          <Typography
            component={'div'}
            fontSize={14}
            fontWeight={600}
            lineHeight={1.2}
          >
            {title}
          </Typography>
        </Stack>
        <DrawersIconConfig.ArrowDown
          size={16}
          sx={{
            transform: visible ? 'rotate(0deg)' : 'rotate(-90deg)',
            transformOrigin: 'center',
            transition: 'all .3s',
          }}
        />
      </Stack>
      <Collapse in={visible}>{children}</Collapse>
    </Stack>
  );
};
