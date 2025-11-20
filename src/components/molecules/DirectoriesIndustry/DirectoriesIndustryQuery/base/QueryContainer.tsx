import { FC, ReactNode } from 'react';
import { Icon, Stack, StackProps, Typography } from '@mui/material';

import ICON_INFO from './assets/icon-info.svg';

interface QueryContainerProps extends StackProps {
  label?: string;
  description?: string;
  children: ReactNode;
}

export const QueryContainer: FC<QueryContainerProps> = ({
  label,
  description,
  children,
  sx,
  ...props
}) => {
  return (
    <Stack
      sx={{
        gap: 1,
        ...sx,
      }}
      {...props}
    >
      <Stack>
        {label && (
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Typography sx={{ fontSize: 12, color: 'text.focus' }}>
              {label}
            </Typography>
            <Icon component={ICON_INFO} sx={{ width: 12, height: 12 }} />
          </Stack>
        )}
        {description && (
          <Typography
            sx={{
              fontSize: 12,
              color: '#B0ADBD',
            }}
          >
            {description}
          </Typography>
        )}
      </Stack>

      {children}
    </Stack>
  );
};
