import { Box, Collapse, Icon, Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import ICON_ARROW from './assets/icon-arrow-down.svg';
import { useSwitch } from '@/hooks';

type CollapsePanelProps = {
  title: string;
  filterCount?: number;
};
export const CollapsePanel: FC<PropsWithChildren<CollapsePanelProps>> = ({
  title,
  children,
  filterCount,
}) => {
  const { visible, toggle } = useSwitch();
  return (
    <Stack
      border={'1px solid #DFDEE6'}
      borderRadius={2}
      gap={visible ? 1 : 0}
      p={1.5}
      sx={{
        transition: 'all .3s',
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        height={22}
        justifyContent={'space-between'}
        onClick={toggle}
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Typography
          lineHeight={1.2}
          sx={{
            userSelect: 'none',
          }}
          variant={'subtitle2'}
        >
          {title}
        </Typography>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
          {!!filterCount && (
            <Box
              bgcolor={'#EFE9FB'}
              borderRadius={1}
              fontSize={12}
              px={1}
              py={'2px'}
              sx={{
                userSelect: 'none',
              }}
            >
              {filterCount} {`filter${filterCount > 1 ? 's' : ''}`}
            </Box>
          )}
          <Icon
            component={ICON_ARROW}
            sx={{
              width: 16,
              height: 16,
              transform: !visible ? 'rotate(-90deg)' : 'rotate(0deg)',
            }}
          />
        </Stack>
      </Stack>
      <Collapse in={visible}>
        <Stack gap={1}>{children}</Stack>
      </Collapse>
    </Stack>
  );
};
