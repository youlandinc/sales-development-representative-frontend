import { Icon, Stack, StackProps, Tooltip, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import ICON_INFO from '../assets/icon_info.svg';

interface StyledTooltipLabelProps extends StackProps {
  label: string;
  tooltip: string;
}

export const StyledTooltipLabel: FC<
  PropsWithChildren<StyledTooltipLabelProps>
> = ({ label, tooltip, children, ...props }) => {
  return (
    <Stack gap={0.5} {...props}>
      <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
        <Typography fontSize={14} lineHeight={1.4}>
          {label}
        </Typography>
        <Tooltip title={tooltip}>
          <Icon
            component={ICON_INFO}
            sx={{ width: 12, height: 12, '& path': { fill: '#6F6C7D' } }}
          />
        </Tooltip>
      </Stack>
      {children}
    </Stack>
  );
};
