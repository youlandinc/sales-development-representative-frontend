import { FC, ReactNode } from 'react';
import {
  Box,
  Icon,
  Stack,
  StackProps,
  SxProps,
  Tooltip,
  Typography,
} from '@mui/material';

import { QUERY_TOOLTIP_SLOT_PROPS, QueryBadgeAuth, QueryTips } from './index';

import ICON_INFO from './assets/icon-info.svg';

interface QueryContainerProps extends StackProps {
  label?: string | null;
  labelSx?: SxProps;
  description?: string | null;
  tooltip?: string | null;
  children: ReactNode;
  isAuth?: boolean;
  showTips?: boolean | null;
}

export const QueryContainer: FC<QueryContainerProps> = ({
  label,
  description,
  tooltip,
  children,
  sx,
  labelSx,
  isAuth = true,
  showTips,
  ...props
}) => {
  return (
    <Stack sx={{ gap: 1, ...sx }} {...props}>
      <Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {label && (
            <Typography
              component="span"
              sx={{ fontSize: 12, color: 'text.focus', ...labelSx }}
            >
              {label}
              {tooltip && (
                <Tooltip
                  arrow
                  placement="top"
                  slotProps={QUERY_TOOLTIP_SLOT_PROPS}
                  title={tooltip}
                >
                  <Icon
                    component={ICON_INFO}
                    sx={{
                      width: 12,
                      height: 12,
                      ml: 0.5,
                      verticalAlign: 'middle',
                    }}
                  />
                </Tooltip>
              )}
              {showTips && <QueryTips />}
            </Typography>
          )}
          {!isAuth && (
            <Box sx={{ flexShrink: 0, ml: 1 }}>
              <QueryBadgeAuth />
            </Box>
          )}
        </Stack>
        {description && (
          <Typography sx={{ fontSize: 12, color: '#B0ADBD', mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Stack>
      {children}
    </Stack>
  );
};
