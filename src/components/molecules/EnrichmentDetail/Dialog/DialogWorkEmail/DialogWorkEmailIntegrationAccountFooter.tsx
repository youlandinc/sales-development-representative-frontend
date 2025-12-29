import { useParams } from 'next/navigation';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { StyledButton } from '@/components/atoms';
import { DialogFooter } from '@/components/molecules/EnrichmentDetail/Dialog/Common';

import { useProspectTableStore } from '@/stores/enrichment';
import { useWorkEmailStore } from '@/stores/enrichment/useWorkEmailStore';
import {
  useComputedInWorkEmailStore,
  useIntegrationAccountRequest,
  useWorkEmailRequest,
} from './hooks';

import {
  DisplayTypeEnum,
  SourceOfOpenEnum,
  WaterfallConfigTypeEnum,
} from '@/types/enrichment';

import { COINS_PER_ROW } from '@/constants';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

interface DialogWorkEmailIntegrationAccountFooterProps {
  cb?: () => void;
}

export const DialogWorkEmailIntegrationAccountFooter: FC<
  DialogWorkEmailIntegrationAccountFooterProps
> = ({ cb }) => {
  const rowIds = useProspectTableStore((store) => store.rowIds);
  const { isMissingConfig } = useComputedInWorkEmailStore();
  const {
    setWaterfallConfigType,
    setDisplayType,
    selectedIntegrationToConfig,
  } = useWorkEmailStore(
    useShallow((state) => ({
      setWaterfallConfigType: state.setWaterfallConfigType,
      setDisplayType: state.setDisplayType,
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
  const { saveOrRunIntegrationAccount } = useIntegrationAccountRequest(cb);

  const isDisabled =
    sourceOfOpen === SourceOfOpenEnum.dialog
      ? selectedIntegrationToConfig?.inputParams?.some((p) => !p.selectedOption)
      : isMissingConfig;

  const handleAction = (recordCount: number, shouldRun = true) => {
    if (sourceOfOpen === SourceOfOpenEnum.dialog) {
      if (selectedIntegrationToConfig) {
        saveOrRunIntegrationAccount(
          {
            tableId,
            actionKey: selectedIntegrationToConfig.actionKey,
            inputBinding:
              selectedIntegrationToConfig?.inputParams?.map((param) => ({
                name: param.semanticType,
                formulaText: param.selectedOption?.value || '',
              })) || [],
          },
          shouldRun,
          recordCount,
        );
      }
    } else {
      requestState?.request?.(tableId, recordCount, shouldRun);
    }
  };

  return (
    <DialogFooter
      coinsPerRow={COINS_PER_ROW}
      disabled={requestState?.state?.loading || isDisabled}
      loading={requestState?.state?.loading}
      onClickToSaveAndRun10={() => {
        handleAction(10);
      }}
      onClickToSaveAndRunAll={() => {
        handleAction(rowIds.length);
      }}
      onClickToSaveDoNotRun={() => {
        handleAction(rowIds.length, false);
      }}
      slot={
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
