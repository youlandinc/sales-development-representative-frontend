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
    <Stack gap={1.5} {...props}>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
        <Typography>{label}</Typography>
        <Tooltip title={tooltip}>
          <Icon component={ICON_INFO} sx={{ width: 16, height: 16 }} />
        </Tooltip>
      </Stack>
      {children}
    </Stack>
  );
};
