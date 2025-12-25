import { useParams } from 'next/navigation';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { StyledButton } from '@/components/atoms';
import { DialogFooter } from '@/components/molecules/EnrichmentDetail/Dialog/Common';

import { useEnrichmentTableStore } from '@/stores/enrichment';
import { useWorkEmailStore } from '@/stores/enrichment/useWorkEmailStore';
import { useComputedInWorkEmailStore, useWorkEmailRequest } from './hooks';

import { DisplayTypeEnum, WaterfallConfigTypeEnum } from '@/types/enrichment';

import { COINS_PER_ROW } from '@/constants';

interface DialogWorkEmailFooterProps {
  cb?: () => void;
}

export const DialogWorkEmailFooter: FC<DialogWorkEmailFooterProps> = ({
  cb,
}) => {
  const { rowIds } = useEnrichmentTableStore((store) => store);
  const { isMissingConfig } = useComputedInWorkEmailStore();
  const { setWaterfallConfigType, setDisplayType, displayType } =
    useWorkEmailStore(
      useShallow((state) => ({
        setWaterfallConfigType: state.setWaterfallConfigType,
        setDisplayType: state.setDisplayType,
        displayType: state.displayType,
      })),
    );
  const params = useParams();
  const tableId =
    typeof params.tableId === 'string' && params.tableId.trim() !== ''
      ? params.tableId
      : '';
  const { requestState } = useWorkEmailRequest(tableId, cb);

  return (
    <DialogFooter
      coinsPerRow={COINS_PER_ROW}
      disabled={requestState?.state?.loading || isMissingConfig}
      loading={requestState?.state?.loading}
      onClickToSaveAndRun10={() => {
        requestState?.request?.(tableId, 10);
      }}
      onClickToSaveAndRunAll={() => {
        requestState?.request?.(tableId, rowIds.length);
      }}
      onClickToSaveDoNotRun={() => {
        requestState?.request?.(tableId, rowIds.length, false);
      }}
      slot={
        displayType === DisplayTypeEnum.integration ? (
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
        ) : null
      }
    />
  );

  /* return (
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
            onClickToSaveWaterfallStep?.();
          }}
          sx={{ height: '40px !important' }}
          variant={'contained'}
        >
          Save waterfall step
        </StyledButton>
      ) : (
        <>
          <StyledCost
            border={'1px solid #F4F5F9'}
            borderRadius={2}
            count={`${coinsPerRow}`}
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
            },
          },
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
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {rowIds.length > 10 && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              requestState?.request?.(tableId, 10);
              onClickToSaveAndRun10?.();
            }}
          >
            <Typography color={'text.secondary'} variant={'body2'}>
              Save and run 10 rows
            </Typography>
            <StyledCost
              bgcolor={'transparent'}
              border={'1px solid #F4F5F9'}
              borderRadius={2}
              count={`${coinsPerRow * 10}`}
              textColor={'text.secondary'}
            />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            requestState?.request?.(tableId, rowIds.length);
            onClickToSaveAndRunAll?.();
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
        <MenuItem
          onClick={async () => {
            setAnchorEl(null);
            requestState?.request?.(tableId, rowIds.length, false);
            onClickToSaveDoNotRun?.();
          }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Save and don&#39;t run
          </Typography>
        </MenuItem>
      </Menu>
    </Stack>
  ); */
};
