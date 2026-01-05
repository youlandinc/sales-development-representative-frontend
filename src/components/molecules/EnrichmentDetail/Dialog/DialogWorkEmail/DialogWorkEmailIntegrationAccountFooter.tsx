import { useParams } from 'next/navigation';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { StyledButton } from '@/components/atoms';
import { DialogFooter } from '@/components/molecules/EnrichmentDetail/Dialog/Common';

import { ActiveTypeEnum, useEnrichmentTableStore } from '@/stores/enrichment';
import { useWorkEmailStore } from '@/stores/enrichment/useWorkEmailStore';
import { useIntegrationAccountRequest } from './hooks';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import {
  DisplayTypeEnum,
  SourceOfOpenEnum,
  WaterfallConfigTypeEnum,
} from '@/types/enrichment';

import { COINS_PER_ROW } from '@/constants';

interface DialogWorkEmailIntegrationAccountFooterProps {
  cb?: () => void;
}

export const DialogWorkEmailIntegrationAccountFooter: FC<
  DialogWorkEmailIntegrationAccountFooterProps
> = ({ cb }) => {
  const rowIds = useEnrichmentTableStore((store) => store.rowIds);
  const {
    setWaterfallConfigType,
    setDisplayType,
    selectedIntegrationToConfig,
    activeType,
  } = useWorkEmailStore(
    useShallow((state) => ({
      setWaterfallConfigType: state.setWaterfallConfigType,
      setDisplayType: state.setDisplayType,
      selectedIntegrationToConfig: state.selectedIntegrationToConfig,
      activeType: state.activeType,
    })),
  );
  const sourceOfOpen = useActionsStore((store) => store.sourceOfOpen);
  const params = useParams();
  const tableId =
    typeof params.tableId === 'string' && params.tableId.trim() !== ''
      ? params.tableId
      : '';
  const { saveOrRunIntegrationAccount, saveState } =
    useIntegrationAccountRequest(cb);

  const isDisabled = selectedIntegrationToConfig?.inputParams?.some(
    (p) => !p.selectedOption,
  );

  const handleAction = (recordCount: number, shouldRun = true) => {
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
  };

  return (
    <DialogFooter
      coinsPerRow={COINS_PER_ROW}
      disabled={saveState?.loading || isDisabled}
      loading={saveState?.loading}
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
        sourceOfOpen !== SourceOfOpenEnum.dialog &&
        activeType !== ActiveTypeEnum.edit ? (
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
