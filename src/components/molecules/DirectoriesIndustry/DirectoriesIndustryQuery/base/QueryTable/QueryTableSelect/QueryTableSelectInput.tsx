import { FC, MouseEvent, useState } from 'react';
import {
  CircularProgress,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { EnrichmentTableEnum } from '@/types';

import { QueryTableIcon, TABLE_SOURCE_ICON } from './QueryTableIcons';

interface QueryTableSelectInputProps {
  selectedTableName: string;
  onOpenDialog: () => void;
  onClearSelection: () => void;
  selectedTableId?: string;
  selectedTableSource?: EnrichmentTableEnum;
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
  const isMenuOpen = Boolean(anchorEl);

  const onClickToOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickToCloseMenu = () => {
    setAnchorEl(null);
  };

  const onClickToOpenTable = () => {
    if (selectedTableId) {
      window.open(`/enrichment/${selectedTableId}`, '_blank');
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
          border: '1px solid',
          borderColor: 'border.default',
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          '&:hover': {
            bgcolor: 'background.active',
            borderColor: 'border.default',
          },
        }}
      >
        {selectedTableName &&
          selectedTableSource &&
          TABLE_SOURCE_ICON[selectedTableSource]}
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
            opacity: selectedTableName ? 1 : 0.5,
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
                <QueryTableIcon.Folder
                  onClick={onOpenDialog}
                  size={16}
                  sx={{
                    flexShrink: 0,
                    cursor: 'pointer',
                    '&:hover': { '& path': { fill: '#363440' } },
                  }}
                />
                <QueryTableIcon.Close
                  onClick={onClearSelection}
                  size={16}
                  sx={{
                    flexShrink: 0,
                    cursor: 'pointer',
                    '&:hover': { '& path': { fill: '#363440' } },
                    '& path': { fill: '#6F6C7D' },
                  }}
                />
              </>
            )
          ) : (
            <QueryTableIcon.Folder
              onClick={onOpenDialog}
              size={16}
              sx={{
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
            <QueryTableIcon.More size={16} />
          </Stack>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onClose={onClickToCloseMenu}
            open={isMenuOpen}
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
              <QueryTableIcon.Open size={16} />
              <Typography fontSize={12}>Open table</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </Stack>
  );
};
