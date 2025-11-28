import { FC, ReactNode } from 'react';
import {
  Icon,
  Stack,
  StackProps,
  SxProps,
  Tooltip,
  Typography,
} from '@mui/material';

import { QueryBadgeAuth } from './index';

import ICON_INFO from './assets/icon-info.svg';

interface QueryContainerProps extends StackProps {
  label?: string | null;
  labelSx?: SxProps;
  description?: string | null;
  tooltip?: string | null;
  children: ReactNode;
  isAuth?: boolean;
}

export const QueryContainer: FC<QueryContainerProps> = ({
  label,
  description,
  tooltip,
  children,
  sx,
  labelSx,
  isAuth = true,
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
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {label && (
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography
                sx={{ fontSize: 12, color: 'text.focus', ...labelSx }}
              >
                {label}
              </Typography>
              {tooltip && (
                <Tooltip arrow title={tooltip}>
                  <Icon component={ICON_INFO} sx={{ width: 12, height: 12 }} />
                </Tooltip>
              )}
            </Stack>
          )}
          {!isAuth && <QueryBadgeAuth />}
        </Stack>

        {description && (
          <Typography
            sx={{
              fontSize: 12,
              color: '#B0ADBD',
              mt: 0.5,
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
