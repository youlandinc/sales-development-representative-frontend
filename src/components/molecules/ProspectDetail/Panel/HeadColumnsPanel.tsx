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
import { TableColumnTypeEnum } from '@/types/Prospect/table';

import ICON_COLUMN from '../assets/head/icon-column.svg';

import ICON_COLUMN_HIDE from '../assets/table/icon-column-hide.svg';
import ICON_COLUMN_VISIBLE from '../assets/table/icon-column-visible.svg';

import ICON_TYPE_TEXT from '../assets/head/icon-type-text.svg';
import ICON_TYPE_NUMBER from '../assets/head/icon-type-number.svg';
import ICON_TYPE_EMAIL from '../assets/head/icon-type-email.svg';
import ICON_TYPE_PHONE from '../assets/head/icon-type-phone.svg';
import ICON_TYPE_CURRENCY from '../assets/head/icon-type-currency.svg';
import ICON_TYPE_DATE from '../assets/head/icon-type-date.svg';
import ICON_TYPE_URL from '../assets/head/icon-type-url.svg';
import ICON_TYPE_IMG_URL from '../assets/head/icon-type-img-url.svg';
import ICON_TYPE_CHECKBOX from '../assets/head/icon-type-checkbox.svg';
import ICON_TYPE_SELECT from '../assets/head/icon-type-select.svg';

const ICON_HASH = {
  [TableColumnTypeEnum.text]: ICON_TYPE_TEXT,
  [TableColumnTypeEnum.number]: ICON_TYPE_NUMBER,
  [TableColumnTypeEnum.email]: ICON_TYPE_EMAIL,
  [TableColumnTypeEnum.phone]: ICON_TYPE_PHONE,
  [TableColumnTypeEnum.currency]: ICON_TYPE_CURRENCY,
  [TableColumnTypeEnum.date]: ICON_TYPE_DATE,
  [TableColumnTypeEnum.url]: ICON_TYPE_URL,
  [TableColumnTypeEnum.img_url]: ICON_TYPE_IMG_URL,
  [TableColumnTypeEnum.checkbox]: ICON_TYPE_CHECKBOX,
  [TableColumnTypeEnum.select]: ICON_TYPE_SELECT,
};

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
                          bgcolor: '#F7F4FD',
                          '& .action': {
                            display: 'block',
                          },
                        },
                      }}
                    >
                      <Icon
                        component={ICON_HASH[col.fieldType]}
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
