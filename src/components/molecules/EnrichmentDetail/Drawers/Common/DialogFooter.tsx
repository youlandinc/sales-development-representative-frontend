import {
  Box,
  Menu,
  MenuItem,
  menuItemClasses,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { FC, ReactNode, useState } from 'react';

import { StyledButton, StyledCost } from '@/components/atoms';
import { DrawersIconConfig } from '../index';

import { useEnrichmentTableStore } from '@/stores/enrichment';

interface DialogFooterProps {
  cb?: () => void;
  coinsPerRow: number;
  onClickToSaveAndRun10?: (tableId: string, rowCount: number) => void;
  onClickToSaveAndRunAll?: (tableId: string, rowCount: number) => void;
  onClickToSaveDoNotRun?: (tableId: string, rowCount: number) => void;
  loading?: boolean;
  disabled?: boolean;
  slot?: ReactNode;
}

export const DialogFooter: FC<DialogFooterProps> = ({
  coinsPerRow,
  onClickToSaveAndRun10,
  onClickToSaveAndRunAll,
  onClickToSaveDoNotRun,
  loading,
  disabled,
  slot,
}) => {
  const { rowIds } = useEnrichmentTableStore((store) => store);
  const params = useParams();
  const tableId =
    typeof params.tableId === 'string' && params.tableId.trim() !== ''
      ? params.tableId
      : '';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Stack
      sx={{
        alignItems: 'center',
        borderTop: '1px solid #D0CEDA',
        flexDirection: 'row',
        gap: 1,
        justifyContent: 'flex-end',
        mt: 'auto',
        px: 3,
        py: 1.5,
      }}
    >
      {slot ? (
        slot
      ) : (
        <>
          <StyledCost
            border={'1px solid #F4F5F9'}
            borderRadius={2}
            count={`${coinsPerRow}`}
            textColor={'text.secondary'}
          />
          <StyledButton
            disabled={disabled}
            endIcon={
              !loading && (
                <DrawersIconConfig.ArrowDown
                  size={12}
                  sx={{
                    '& path': { fill: 'currentColor' },
                  }}
                />
              )
            }
            loading={loading}
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
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        open={Boolean(anchorEl)}
        slotProps={{
          paper: {
            sx: {
              transform: 'translateY(-18px) !important',
              boxShadow: 'none',
              border: '1px solid #F0F0F4',
              borderRadius: 2,
            },
          },
          list: {
            sx: {
              p: 0,
              gap: '4px',
              display: 'flex',
              flexDirection: 'column',
              width: 400,
              [`& .${menuItemClasses.root}`]: {
                justifyContent: 'space-between',
                height: '36px',
                px: 1,
              },
            },
          },
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {rowIds.length > 10 && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onClickToSaveAndRun10?.(tableId, 10);
            }}
          >
            <Typography color={'text.secondary'} variant={'body2'}>
              Save and run 10 rows
            </Typography>
            <StyledCost
              bgcolor={'transparent'}
              border={'1px solid #F4F5F9'}
              borderRadius={2}
              count={`${coinsPerRow}`}
              textColor={'text.secondary'}
            />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onClickToSaveAndRunAll?.(tableId, rowIds.length);
          }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Save and run {rowIds.length} rows in this view
          </Typography>
          <StyledCost
            bgcolor={'transparent'}
            border={'1px solid #F4F5F9'}
            borderRadius={2}
            count={`~${rowIds.length}`}
            textColor={'text.secondary'}
          />
        </MenuItem>
        <Box bgcolor={'#E9E9EF'} height={'1px'} />
        <MenuItem
          onClick={async () => {
            setAnchorEl(null);
            onClickToSaveDoNotRun?.(tableId, rowIds.length);
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
