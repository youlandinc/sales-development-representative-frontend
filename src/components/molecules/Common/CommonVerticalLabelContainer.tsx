import { FC, PropsWithChildren } from 'react';
import { Icon, Stack, StackProps, Tooltip, Typography } from '@mui/material';

import ICON_INFO from './assets/icon_info.svg';

type SizeType = 'small' | 'medium' | 'large';

interface CommonVerticalLabelContainerProps extends StackProps {
  label: string;
  tooltip?: string;
  size?: SizeType;
  iconFillColor?: string;
  hasIcon?: boolean;
}

const STYLE_MAP: Record<
  SizeType,
  { fontSize: number; lineHeight: number; iconSize: number; gap: number }
> = {
  small: { fontSize: 12, lineHeight: 1.4, iconSize: 12, gap: 0.5 },
  medium: { fontSize: 14, lineHeight: 1.4, iconSize: 12, gap: 0.5 },
  large: { fontSize: 16, lineHeight: 1.4, iconSize: 12, gap: 1 },
};

export const CommonVerticalLabelContainer: FC<
  PropsWithChildren<CommonVerticalLabelContainerProps>
> = ({
  label,
  tooltip,
  size = 'medium',
  children,
  iconFillColor = '#6F6C7D',
  hasIcon = true,
  ...props
}) => {
  const styles = STYLE_MAP[size];
  const shouldShowIcon = hasIcon && tooltip;

  return (
    <Stack gap={styles.gap} width={'100%'} {...props}>
      <Stack alignItems={'center'} flexDirection={'row'} gap={styles.gap}>
        <Typography fontSize={styles.fontSize} lineHeight={styles.lineHeight}>
          {label}
        </Typography>
        {shouldShowIcon && (
          <Tooltip title={tooltip}>
            <Icon
              component={ICON_INFO}
              sx={{
                width: styles.iconSize,
                height: styles.iconSize,
                '& path': { fill: iconFillColor },
              }}
            />
          </Tooltip>
        )}
      </Stack>
      {children}
    </Stack>
  );
};
