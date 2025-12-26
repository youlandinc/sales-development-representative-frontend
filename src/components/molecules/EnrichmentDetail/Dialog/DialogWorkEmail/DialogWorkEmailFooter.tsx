import { useParams } from 'next/navigation';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { StyledButton } from '@/components/atoms';
import { DialogFooter } from '@/components/molecules/EnrichmentDetail/Dialog/Common';

import { useProspectTableStore } from '@/stores/enrichment';
import { useWorkEmailStore } from '@/stores/enrichment/useWorkEmailStore';
import { useComputedInWorkEmailStore, useWorkEmailRequest } from './hooks';

import {
  DisplayTypeEnum,
  SourceOfOpenEnum,
  WaterfallConfigTypeEnum,
} from '@/types/enrichment';

import { COINS_PER_ROW } from '@/constants';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

interface DialogWorkEmailFooterProps {
  cb?: () => void;
}

export const DialogWorkEmailFooter: FC<DialogWorkEmailFooterProps> = ({
  cb,
}) => {
  const rowIds = useProspectTableStore((store) => store.rowIds);
  const { isMissingConfig } = useComputedInWorkEmailStore();
  const {
    setWaterfallConfigType,
    setDisplayType,
    displayType,
    selectedIntegrationToConfig,
  } = useWorkEmailStore(
    useShallow((state) => ({
      setWaterfallConfigType: state.setWaterfallConfigType,
      setDisplayType: state.setDisplayType,
      displayType: state.displayType,
      selectedIntegrationToConfig: state.selectedIntegrationToConfig,
    })),
  );
  const sourceOfOpen = useActionsStore((store) => store.sourceOfOpen);
  const params = useParams();
  const tableId =
    typeof params.tableId === 'string' && params.tableId.trim() !== ''
      ? params.tableId
      : '';
  const { requestState } = useWorkEmailRequest(tableId, cb);

  const isDisabled =
    sourceOfOpen === SourceOfOpenEnum.dialog
      ? selectedIntegrationToConfig?.inputParams?.some((p) => !p.selectedOption)
      : isMissingConfig;

  return (
    <DialogFooter
      coinsPerRow={COINS_PER_ROW}
      disabled={requestState?.state?.loading || isDisabled}
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
        displayType === DisplayTypeEnum.integration &&
        sourceOfOpen !== SourceOfOpenEnum.dialog ? (
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
};
