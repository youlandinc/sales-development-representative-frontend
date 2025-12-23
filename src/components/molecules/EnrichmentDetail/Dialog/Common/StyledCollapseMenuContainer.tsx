import { ElementType, FC, PropsWithChildren, ReactNode } from 'react';
import { Collapse, Icon, Stack, Typography } from '@mui/material';

import { useSwitch } from '@/hooks';

import ICON_ARROW from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_arrow_down.svg';

interface StyledCollapseMenuContainerProps {
  icon?: ElementType;
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
        }}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={0.5}
          justifyContent={'space-between'}
        >
          {icon && <Icon component={icon} sx={{ width: 20, height: 20 }} />}
          <Typography
            component={'div'}
            fontSize={14}
            fontWeight={600}
            lineHeight={1.2}
          >
            {title}
          </Typography>
        </Stack>
        <Icon
          component={ICON_ARROW}
          sx={{
            width: 16,
            height: 16,
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
