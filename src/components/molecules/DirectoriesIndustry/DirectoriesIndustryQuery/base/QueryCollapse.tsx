import { FC, MouseEvent, ReactNode, useState } from 'react';
import { Collapse, Icon, Stack } from '@mui/material';

import { QueryBadgeAuth } from './index';

import ICON_ARROW from './assets/icon-arrow.svg';
import ICON_CLOSE from './assets/icon-close.svg';

interface QueryCollapseProps {
  title?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  filterCount?: number;
  isAuth: boolean;
  onClearFilters?: () => void;
}

export const QueryCollapse: FC<QueryCollapseProps> = ({
  title,
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
        border: '1px solid #eae9ef',
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
            fontSize: 14,
            height: 20,
            fontWeight: 600,
            gap: 1.5,
          }}
        >
          {title}
          <Stack
            sx={{
              ml: 'auto',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {filterCount > 0 && (
              <Stack
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                sx={{
                  bgcolor: '#EAE9EF',
                  borderRadius: 1,
                  fontSize: 12,
                  px: 1,
                  py: '2px',
                  userSelect: 'none',
                  fontWeight: 400,
                  flexDirection: 'row',
                  gap: 0.5,
                  alignItems: 'center',
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
                />{' '}
                {filterCount} {`filter${filterCount > 1 ? 's' : ''}`}
              </Stack>
            )}
            {!isAuth && <QueryBadgeAuth />}
            <Icon
              component={ICON_ARROW}
              sx={{
                ml: 'auto',
                width: 12,
                height: 12,
                transform: `rotate(${expanded ? '.25' : '0'}turn)`,
                transition: 'transform .3s',
              }}
            />
          </Stack>
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
