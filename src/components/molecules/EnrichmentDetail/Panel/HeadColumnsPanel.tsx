import { useMemo, useState } from 'react';
import {
  ClickAwayListener,
  Grow,
  Icon,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';

import { useProspectTableStore } from '@/stores/enrichment';
import { COLUMN_TYPE_ICONS } from '@/constants/table';

import ICON_COLUMN from '../assets/head/icon-column.svg';
import ICON_COLUMN_HIDE from '../assets/table/icon-column-hide.svg';
import ICON_COLUMN_VISIBLE from '../assets/table/icon-column-visible.svg';

export const HeadColumnsPanel = () => {
  const { columns, updateColumnVisible } = useProspectTableStore(
    (store) => store,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const columnsVisible = useMemo(() => {
    return columns.filter((col) => col.visible).length;
  }, [columns]);

  return (
    <>
      <Stack
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          gap: 0.5,
          px: 1.5,
          borderRadius: 1,
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': { bgcolor: '#EDEDED' },
        }}
      >
        <Icon component={ICON_COLUMN} sx={{ width: 20, height: 20 }} />
        <Typography fontSize={14}>
          {columnsVisible}/{columns.length} columns
        </Typography>
      </Stack>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Paper
              sx={{
                mt: 1,
                borderRadius: 2,
                boxShadow: ' 0 1px 4px 0 rgba(50, 43, 83, 0.16)',
                minWidth: 260,
              }}
            >
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Stack gap={1} p={1.5}>
                  {columns.map((col) => (
                    <Stack
                      alignItems={'center'}
                      flexDirection={'row'}
                      gap={1.25}
                      key={col.fieldId}
                      onClick={async () => {
                        await updateColumnVisible(col.fieldId, !col.visible);
                      }}
                      sx={{
                        borderRadius: 1,
                        cursor: 'pointer',
                        px: 1,
                        '&:hover': {
                          bgcolor: '#F4F5F9',
                          '& .action': {
                            display: 'block',
                          },
                        },
                      }}
                    >
                      <Icon
                        component={COLUMN_TYPE_ICONS[col.fieldType]}
                        sx={{
                          width: 16,
                          height: 16,
                          '& path': {
                            fill: !col.visible ? '#B0ADBD' : '#2A292E',
                          },
                        }}
                      />
                      <Typography
                        color={col.visible ? 'text.primary' : '#B0ADBD'}
                        fontSize={14}
                      >
                        {col.fieldName}
                      </Typography>
                      <Icon
                        className={'action'}
                        component={
                          col.visible ? ICON_COLUMN_VISIBLE : ICON_COLUMN_HIDE
                        }
                        sx={{
                          ml: 'auto',
                          width: 16,
                          height: 16,
                          display: !col.visible ? 'block' : 'none',
                          '& path': {
                            fill: !col.visible ? '#B0ADBD' : '#2A292E',
                          },
                        }}
                      />
                    </Stack>
                  ))}
                </Stack>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
