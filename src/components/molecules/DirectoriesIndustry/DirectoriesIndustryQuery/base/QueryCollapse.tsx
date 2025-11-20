import { FC, ReactNode, useState } from 'react';
import { Collapse, Icon, Stack } from '@mui/material';

import ICON_ARROW from './assets/icon-arrow.svg';

interface QueryCollapseProps {
  title?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const QueryCollapse: FC<QueryCollapseProps> = ({
  title,
  children,
  defaultOpen = true,
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
            lineHeight: 1.2,
            fontWeight: 600,
          }}
        >
          {title}
          {/*todo : filter count*/}
          {/*<Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>*/}
          {/*  {!!filterCount && (*/}
          {/*    <Box*/}
          {/*      bgcolor={'#EAE9EF'}*/}
          {/*      borderRadius={1}*/}
          {/*      fontSize={12}*/}
          {/*      px={1}*/}
          {/*      py={'2px'}*/}
          {/*      sx={{*/}
          {/*        userSelect: 'none',*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      {filterCount} {`filter${filterCount > 1 ? 's' : ''}`}*/}
          {/*    </Box>*/}
          {/*  )}*/}
          {/*  <Icon*/}
          {/*    component={ICON_ARROW}*/}
          {/*    sx={{*/}
          {/*      width: 16,*/}
          {/*      height: 16,*/}
          {/*      transform: !visible ? 'rotate(-90deg)' : 'rotate(0deg)',*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Stack>*/}
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
