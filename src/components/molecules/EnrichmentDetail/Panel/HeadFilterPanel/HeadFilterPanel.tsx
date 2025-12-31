import { useState } from 'react';
import {
  ClickAwayListener,
  Grow,
  Icon,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { useShallow } from 'zustand/shallow';

import {
  PAPPER_STACK_CONTAINER_SX,
  PAPPER_SX,
  STACK_CONTAINER_SX,
} from '../config';
import { useEnrichmentTableStore } from '@/stores/enrichment';
import { TableFilterRequestParams } from '@/types/enrichment/tableFilter';

import { StyledButton, StyledSelect } from '@/components/atoms';
import { FilterFooter } from './index';

import ICON_ADD from './asset/icon-add.svg';
import ICON_FILTER from './asset/icon-filter.svg';

export const HeadFilterPanel = () => {
  const { columns } = useEnrichmentTableStore(
    useShallow((state) => ({
      columns: state.columns,
    })),
  );

  //console.log(columns);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [temp, setTemp] = useState();

  const [requestData, setRequestData] = useState<TableFilterRequestParams>([]);

  return (
    <>
      <Stack
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={STACK_CONTAINER_SX}
      >
        <Icon component={ICON_FILTER} sx={{ width: 20, height: 20 }} />
        <Typography sx={{ fontSize: 14, lineHeight: 1.4 }}>
          No filters
        </Typography>
      </Stack>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement="bottom"
        sx={{ zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Paper sx={{ ...PAPPER_SX }}>
              <ClickAwayListener
                mouseEvent={'onMouseDown'}
                onClickAway={() => setAnchorEl(null)}
                touchEvent={'onTouchStart'}
              >
                <Stack
                  sx={{
                    ...PAPPER_STACK_CONTAINER_SX,
                    width: 'min(100vw,760px)',
                    px: 3,
                    py: 1.5,
                    gap: 1.5,
                  }}
                >
                  {/*<Stack*/}
                  {/*  sx={{*/}
                  {/*    py: 1,*/}
                  {/*    px: 1.5,*/}
                  {/*    border: '1px solid rgba(210, 214, 225, 0.60)',*/}
                  {/*    borderRadius: 2,*/}
                  {/*    bgcolor: '#F4F5F9',*/}
                  {/*    gap: 1.5,*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  <Stack*/}
                  {/*    sx={{*/}
                  {/*      pl: 1,*/}
                  {/*      flexDirection: 'row',*/}
                  {/*      alignItems: 'center',*/}
                  {/*      gap: 1.5,*/}
                  {/*    }}*/}
                  {/*  >*/}
                  {/*    <Typography*/}
                  {/*      sx={{ color: 'text.secondary', fontSize: 14 }}*/}
                  {/*    >*/}
                  {/*      Where*/}
                  {/*    </Typography>*/}
                  {/*    <StyledSelect*/}
                  {/*      onChange={(e) => {*/}
                  {/*        setTemp(e.target.value);*/}
                  {/*      }}*/}
                  {/*      options={[{ label: '1', key: '1', value: 1 }]}*/}
                  {/*      size={'small'}*/}
                  {/*      value={temp}*/}
                  {/*    />*/}
                  {/*    <StyledSelect*/}
                  {/*      onChange={(e) => {*/}
                  {/*        setTemp(e.target.value);*/}
                  {/*      }}*/}
                  {/*      options={[{ label: '1', key: '1', value: 1 }]}*/}
                  {/*      size={'small'}*/}
                  {/*      value={temp}*/}
                  {/*    />*/}
                  {/*    <StyledSelect*/}
                  {/*      onChange={(e) => {*/}
                  {/*        setTemp(e.target.value);*/}
                  {/*      }}*/}
                  {/*      options={[{ label: '1', key: '1', value: 1 }]}*/}
                  {/*      size={'small'}*/}
                  {/*      value={temp}*/}
                  {/*    />*/}
                  {/*  </Stack>*/}

                  {/*  <Stack*/}
                  {/*    sx={{*/}
                  {/*      pl: 1,*/}
                  {/*      flexDirection: 'row',*/}
                  {/*      alignItems: 'center',*/}
                  {/*      gap: 1.5,*/}
                  {/*    }}*/}
                  {/*  >*/}
                  {/*    <Typography*/}
                  {/*      sx={{ color: 'text.secondary', fontSize: 14 }}*/}
                  {/*    >*/}
                  {/*      and*/}
                  {/*    </Typography>*/}

                  {/*    <StyledButton*/}
                  {/*      color={'info'}*/}
                  {/*      size={'small'}*/}
                  {/*      sx={{ bgcolor: '#fff !important' }}*/}
                  {/*      variant={'outlined'}*/}
                  {/*    >*/}
                  {/*      <Icon*/}
                  {/*        component={ICON_ADD}*/}
                  {/*        sx={{ width: 12, height: 12, mr: 0.5 }}*/}
                  {/*      />*/}
                  {/*      Add filter*/}
                  {/*    </StyledButton>*/}
                  {/*  </Stack>*/}
                  {/*</Stack>*/}
                  <FilterFooter disabled={true} />
                </Stack>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
