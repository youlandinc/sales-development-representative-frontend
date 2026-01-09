import { ActiveCellParams } from '@/types/enrichment';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { CellDetailsThinking } from './CellDetailsThinking';

import { useEnrichmentTableStore } from '@/stores/enrichment/useEnrichmentTableStore';
import {
  ACTION_KEY_AI,
  ACTION_KEY_FIND,
  ACTION_KEY_VALIDATE,
} from '../../Table/config';
import { CellDetailsFinding } from './CellDetailsFinding';

interface DrawerCellDetailsProps {
  cellDetails: ActiveCellParams;
}

export const DrawerCellDetails: FC<DrawerCellDetailsProps> = ({
  cellDetails,
}) => {
  const { getMetaColumnById } = useEnrichmentTableStore(
    useShallow((store) => ({
      getMetaColumnById: store.getMetaColumnById,
    })),
  );

  const metaColumn = getMetaColumnById(cellDetails.columnId);

  if (metaColumn?.actionKey === ACTION_KEY_AI) {
    return <CellDetailsThinking cellDetails={cellDetails} />;
  }

  if (
    metaColumn?.actionKey?.includes(ACTION_KEY_FIND) ||
    metaColumn?.actionKey?.includes(ACTION_KEY_VALIDATE)
  ) {
    return <CellDetailsFinding cellDetails={cellDetails} />;
  }

  return null;
};
