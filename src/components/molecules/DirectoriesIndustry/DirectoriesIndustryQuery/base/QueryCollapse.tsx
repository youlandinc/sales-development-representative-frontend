import { FC, MouseEvent, ReactNode, useState } from 'react';
import { Box, Collapse, Icon, Stack, Tooltip, Typography } from '@mui/material';

import { QueryBadgeAuth } from './index';
import { QUERY_TOOLTIP_SLOT_PROPS } from './QueryTooltip';

import ICON_INFO from './assets/icon-info.svg';

import ICON_ARROW from './assets/icon-arrow.svg';
import ICON_CLOSE from './assets/icon-close.svg';

interface QueryCollapseProps {
  title?: string | null;
  tooltip?: string | null;
  children: ReactNode;
  defaultOpen?: boolean;
  filterCount?: number;
  isAuth: boolean;
  onClearFilters?: () => void;
}

export const QueryCollapse: FC<QueryCollapseProps> = ({
  title,
  tooltip,
  children,
  defaultOpen = true,
  filterCount = 0,
  isAuth,
  onClearFilters,
}) => {
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <Stack
      sx={{
        border: '1px solid #F0F0F4',
        borderRadius: 2,
        p: 2,
      }}
    >
      {title && (
        <Stack
          onClick={() => setExpanded(!expanded)}
          sx={{
            cursor: 'pointer',
            userSelect: 'none',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Typography component="span" sx={{ fontSize: 14, fontWeight: 600 }}>
            {title}
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
          </Typography>
          <Box
            sx={{
              ml: 'auto',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              gap: 1,
            }}
          >
            {filterCount > 0 && (
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: '#F0F0F4',
                  borderRadius: 1,
                  fontSize: 12,
                  px: 1,
                  py: '2px',
                  fontWeight: 400,
                  cursor: 'default',
                }}
              >
                <Icon
                  component={ICON_CLOSE}
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onClearFilters?.();
                  }}
                  sx={{ width: 14, height: 14, cursor: 'pointer' }}
                />
                {filterCount} {`filter${filterCount > 1 ? 's' : ''}`}
              </Box>
            )}
            {!isAuth && <QueryBadgeAuth />}
            <Icon
              component={ICON_ARROW}
              sx={{
                width: 12,
                height: 12,
                transform: `rotate(${expanded ? '.25' : '0'}turn)`,
                transition: 'transform .3s',
              }}
            />
          </Box>
        </Stack>
      )}
      <Collapse in={expanded}>
        <Stack
          sx={{
            gap: 1.5,
            mt: 1.5,
          }}
        >
          {children}
        </Stack>
      </Collapse>
    </Stack>
  );
};
