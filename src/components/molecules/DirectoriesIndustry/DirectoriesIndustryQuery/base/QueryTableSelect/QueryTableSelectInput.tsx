import { FC, MouseEvent, useState } from 'react';
import {
  CircularProgress,
  Icon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { ProspectTableEnum } from '@/types';

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
  [ProspectTableEnum.blank_table]: ICON_FOLDER,
  [ProspectTableEnum.crm_list]: ICON_FOLDER,
  [ProspectTableEnum.agent]: ICON_FOLDER,
};

interface QueryTableSelectInputProps {
  selectedTableName: string;
  onOpenDialog: () => void;
  onClearSelection: () => void;
  selectedTableId?: string;
  selectedTableSource?: ProspectTableEnum;
  isLoading?: boolean;
  placeholder?: string;
}

export const QueryTableSelectInput: FC<QueryTableSelectInputProps> = ({
  selectedTableName,
  onOpenDialog,
  onClearSelection,
  selectedTableId,
  selectedTableSource,
  isLoading = false,
  placeholder = 'Select table',
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
    <Stack sx={{ flexDirection: 'row', gap: 1 }}>
      <Stack
        sx={{
          px: 1.5,
          gap: 0.5,
          height: 32,
          borderRadius: 2,
          border: '1px solid #DFDEE6',
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {selectedTableName && selectedTableSource && (
          <Icon
            component={ICON_HASH[selectedTableSource]}
            sx={{ width: 16, height: 16, flexShrink: 0 }}
          />
        )}
        <Typography
          onClick={onOpenDialog}
          sx={{
            fontSize: 12,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            py: 0.5,
            cursor: 'pointer',
            color: selectedTableName ? 'text.primary' : 'text.secondary',
          }}
        >
          {selectedTableName || placeholder}
        </Typography>
        <Stack
          sx={{
            alignItems: 'center',
            flexDirection: 'row',
            flexShrink: 0,
            gap: 1.5,
            justifyContent: 'flex-end',
            minWidth: selectedTableName ? 44 : 16,
            ml: 'auto',
          }}
        >
          {selectedTableName ? (
            isLoading ? (
              <CircularProgress size={16} sx={{ color: '#6F6C7D' }} />
            ) : (
              <>
                <Icon
                  component={ICON_FOLDER}
                  onClick={onOpenDialog}
                  sx={{
                    width: 16,
                    height: 16,
                    flexShrink: 0,
                    cursor: 'pointer',
                    '&:hover': { '& path': { fill: '#363440' } },
                  }}
                />
                <Icon
                  component={ICON_CLOSE}
                  onClick={onClearSelection}
                  sx={{
                    width: 16,
                    height: 16,
                    flexShrink: 0,
                    cursor: 'pointer',
                    '&:hover': { '& path': { fill: '#363440' } },
                    '& path': { fill: '#6F6C7D' },
                  }}
                />
              </>
            )
          ) : (
            <Icon
              component={ICON_FOLDER}
              onClick={onOpenDialog}
              sx={{
                width: 16,
                height: 16,
                flexShrink: 0,
                cursor: 'pointer',
                '&:hover': { '& path': { fill: '#363440' } },
              }}
            />
          )}
        </Stack>
      </Stack>
      {selectedTableName && (
        <>
          <Stack
            onClick={onClickToOpenMenu}
            sx={{
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              height: 32,
              width: 32,
              borderRadius: 2,
              border: '1px solid #E5E5E5',
            }}
          >
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
