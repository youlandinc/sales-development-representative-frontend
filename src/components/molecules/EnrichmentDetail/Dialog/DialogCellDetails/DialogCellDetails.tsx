import { ActiveCellParams } from '@/types/enrichment/base';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { DialogCellDetailsThinking } from './DialogCellDetailsThinking';

import { useEnrichmentTableStore } from '@/stores/enrichment/useEnrichmentTableStore';
import {
  ACTION_KEY_AI,
  ACTION_KEY_FIND,
  ACTION_KEY_VALIDATE,
} from '../../Table/config';
import { DialogCellDetailsFinding } from './DialogCellDetailsFinding';

interface DialogCellDetailsProps {
  cellDetails: ActiveCellParams;
}

export const DialogCellDetails: FC<DialogCellDetailsProps> = ({
  cellDetails,
}) => {
  const { getMetaColumnById } = useEnrichmentTableStore(
    useShallow((store) => ({
      getMetaColumnById: store.getMetaColumnById,
    })),
  );

  const metaColumn = getMetaColumnById(cellDetails.columnId);

  if (metaColumn?.actionKey === ACTION_KEY_AI) {
    return <DialogCellDetailsThinking cellDetails={cellDetails} />;
  }

  if (
    metaColumn?.actionKey?.includes(ACTION_KEY_FIND) ||
    metaColumn?.actionKey?.includes(ACTION_KEY_VALIDATE)
  ) {
    return <DialogCellDetailsFinding cellDetails={cellDetails} />;
  }

  return null;
};
