import {
  Icon,
  Menu,
  MenuItem,
  menuItemClasses,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

import { StyledButton, StyledCost } from '@/components/atoms';

import { COINS_PER_ROW } from '@/constants';

import { useProspectTableStore } from '@/stores/Prospect';
import { useWorkEmailStore } from '@/stores/Prospect/useWorkEmailStore';
import { useComputedInWorkEmailStore, useWorkEmailRequest } from './hooks';

import { DisplayTypeEnum, WaterfallConfigTypeEnum } from '@/types/Prospect';

import ICON_ARROW from '@/components/molecules/ProspectDetail/assets/dialog/icon_arrow_down.svg';

interface DialogWorkEmailFooterProps {
  cb?: () => void;
}

export const DialogWorkEmailFooter: FC<DialogWorkEmailFooterProps> = ({
  cb,
}) => {
  const { rowIds } = useProspectTableStore((store) => store);
  const { isMissingConfig } = useComputedInWorkEmailStore();
  const { setWaterfallConfigType, setDisplayType, displayType } =
    useWorkEmailStore((store) => store);
  const { requestState } = useWorkEmailRequest(cb);
  const params = useParams();
  const tableId =
    typeof params.tableId === 'string' && params.tableId.trim() !== ''
      ? params.tableId
      : '';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Stack
      alignItems={'center'}
      borderTop={' 1px solid   #D0CEDA'}
      flexDirection={'row'}
      gap={1}
      justifyContent={'flex-end'}
      mt={'auto'}
      px={3}
      py={1.5}
    >
      {displayType === DisplayTypeEnum.integration ? (
        <StyledButton
          onClick={() => {
            setWaterfallConfigType(WaterfallConfigTypeEnum.configure);
            setDisplayType(DisplayTypeEnum.main);
          }}
          sx={{ height: '40px !important' }}
          variant={'contained'}
        >
          Save waterfall step
        </StyledButton>
      ) : (
        <>
          <StyledCost
            border={'1px solid #D0CEDA'}
            count={`${COINS_PER_ROW}`}
            textColor={'text.secondary'}
          />
          <StyledButton
            disabled={!tableId || isMissingConfig}
            endIcon={
              <Icon
                component={ICON_ARROW}
                sx={{
                  width: 12,
                  height: 12,
                  '& path': { fill: 'currentColor' },
                }}
              />
            }
            loading={requestState?.state?.loading}
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
            size={'medium'}
            sx={{ height: '40px !important', width: 80 }}
            variant={'contained'}
          >
            Save
          </StyledButton>
        </>
      )}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => {
          setAnchorEl(null);
        }}
        open={Boolean(anchorEl)}
        slotProps={{
          list: {
            sx: {
              p: 0,
              width: 400,
              [`& .${menuItemClasses.root}`]: {
                justifyContent: 'space-between',
              },
            },
          },
        }}
      >
        {rowIds.length > 10 && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              requestState?.request?.(tableId, 10);
            }}
          >
            <Typography color={'text.secondary'} variant={'body2'}>
              Save and run 10 rows
            </Typography>
            <StyledCost bgcolor={'#EFE9FB'} count={`~${COINS_PER_ROW * 10}`} />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            requestState?.request?.(tableId, rowIds.length);
          }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Save and run {rowIds.length} rows in this view
          </Typography>
          <StyledCost bgcolor={'#EFE9FB'} count={'~20'} />
        </MenuItem>
        <MenuItem
          onClick={async () => {
            setAnchorEl(null);
            requestState?.request?.(tableId, rowIds.length, false);
          }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Save and don&#39;t run
          </Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};
