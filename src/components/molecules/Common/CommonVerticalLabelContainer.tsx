import { PropsWithChildren } from 'react';
import { StackProps } from '@mui/material';
import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import ICON_INFO from '@/components/molecules/Library/assets/icon_info.svg';
import { Tooltip } from '@mui/material';

interface CommonVerticalLabelContainerProps extends StackProps {
  label: string;
  tooltip: string;
  size?: 'small' | 'medium' | 'large';
}

const STYLE_MAP = {
  small: {
    fontSize: 12,
    lineHeight: 1.4,
    gap: 0.5,
  },
  medium: {
    fontSize: 14,
    lineHeight: 1.4,
    gap: 0.5,
  },
  large: {
    fontSize: 16,
    lineHeight: 1.4,
    gap: 1,
  },
};

export const CommonVerticalLabelContainer: FC<
  PropsWithChildren<CommonVerticalLabelContainerProps>
> = ({ label, tooltip, size = 'medium', children, ...props }) => {
  return (
    <Stack gap={STYLE_MAP[size].gap} {...props}>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={STYLE_MAP[size].gap}
      >
        <Typography
          fontSize={STYLE_MAP[size].fontSize}
          lineHeight={STYLE_MAP[size].lineHeight}
        >
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
