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

import { useProspectTableStore } from '@/stores/Prospect';

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
                boxShadow: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                minWidth: 260,
              }}
            >
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Stack gap={1} p={1.5}>
                  {columns.map((col) => (
                    <Stack
                      alignItems={'center'}
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      key={col.fieldId}
                      onClick={async () => {
                        await updateColumnVisible(col.fieldId, !col.visible);
                      }}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#f7f8f9',
                          '& .action': {
                            display: 'block',
                          },
                        },
                      }}
                    >
                      <Typography
                        color={col.visible ? 'text.primary' : 'text.secondary'}
                        fontSize={14}
                      >
                        {col.fieldName}
                      </Typography>
                      <Icon
                        className={'action'}
                        component={
                          col.visible ? ICON_COLUMN_HIDE : ICON_COLUMN_VISIBLE
                        }
                        sx={{
                          width: 16,
                          height: 16,
                          display: !col.visible ? 'block' : 'none',
                          '& path': {
                            fill: !col.visible ? '#6F6C7D' : '#2A292E',
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
