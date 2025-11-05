import { FC, MouseEvent, useState } from 'react';
import { Icon, Menu, MenuItem, Stack, Typography } from '@mui/material';

import { ProspectTableEnum } from '@/types';
import {
  closeIconSx,
  CONSTANTS,
  folderIconSx,
  hoverableIconSx,
  inputContainerSx,
  moreButtonSx,
  placeholderTextSx,
} from './FilterTableSelect.styles';

import ICON_FOLDER from './assets/icon-folder.svg';
import ICON_CLOSE from './assets/icon-close.svg';
import ICON_MORE from './assets/icon-more.svg';
import ICON_OPEN from './assets/icon-open.svg';

import ICON_PEOPLE from './assets/icon-people.svg';
import ICON_COMPANY from './assets/icon-company.svg';
import ICON_CSV from './assets/icon-csv.svg';

const ICON_HASH: Record<ProspectTableEnum, any> = {
  [ProspectTableEnum.find_people]: ICON_PEOPLE,
  [ProspectTableEnum.find_companies]: ICON_COMPANY,
  [ProspectTableEnum.from_csv]: ICON_CSV,
  [ProspectTableEnum.black_table]: ICON_FOLDER,
  [ProspectTableEnum.crm_list]: ICON_FOLDER,
  [ProspectTableEnum.agent]: ICON_FOLDER,
};

interface FilterTableSelectInputProps {
  selectedTableName: string;
  onOpenDialog: () => void;
  onClearSelection: () => void;
  selectedTableId?: string;
  selectedTableSource?: ProspectTableEnum;
}

export const FilterTableSelectInput: FC<FilterTableSelectInputProps> = ({
  selectedTableName,
  onOpenDialog,
  onClearSelection,
  selectedTableId,
  selectedTableSource,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onClickToOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickToCloseMenu = () => {
    setAnchorEl(null);
  };

  const onClickToOpenTable = () => {
    if (selectedTableId) {
      window.open(`/prospect-enrich/${selectedTableId}`, '_blank');
    }
    onClickToCloseMenu();
  };

  return (
    <Stack flexDirection={'row'} gap={1}>
      <Stack sx={inputContainerSx}>
        {selectedTableName && selectedTableSource && (
          <Icon component={ICON_HASH[selectedTableSource]} sx={folderIconSx} />
        )}
        <Typography
          onClick={onOpenDialog}
          sx={{
            ...placeholderTextSx,
            ...(selectedTableName ? {} : { color: 'text.secondary' }),
          }}
        >
          {selectedTableName || CONSTANTS.PLACEHOLDER_TEXT}
        </Typography>
        {selectedTableName && (
          <Stack flexDirection={'row'} gap={1.5} ml={'auto'}>
            <Icon
              component={ICON_FOLDER}
              onClick={onOpenDialog}
              sx={hoverableIconSx}
            />
            <Icon
              component={ICON_CLOSE}
              onClick={onClearSelection}
              sx={closeIconSx}
            />
          </Stack>
        )}
      </Stack>
      {selectedTableName && (
        <>
          <Stack onClick={onClickToOpenMenu} sx={moreButtonSx}>
            <Icon component={ICON_MORE} sx={{ width: 16, height: 16 }} />
          </Stack>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onClose={onClickToCloseMenu}
            open={open}
            slotProps={{
              paper: {
                sx: {
                  mt: 0.5,
                  boxShadow: '0 1px 4px 0 rgba(46, 46, 46, 0.25) !important',
                  '& .MuiList-root': {
                    padding: 0,
                  },
                },
              },
            }}
            sx={{
              '& .MuiMenu-list': {
                p: 0,
                '& .MuiMenuItem-root': {
                  bgcolor: 'transparent !important',
                },
                '& .MuiMenuItem-root:hover': {
                  bgcolor: 'rgba(144, 149, 163, 0.1) !important',
                },
              },
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={onClickToOpenTable} sx={{ px: 1.5, gap: 1 }}>
              <Icon component={ICON_OPEN} sx={{ width: 16, height: 16 }} />
              <Typography fontSize={12}>Open table</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </Stack>
  );
};
