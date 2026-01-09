import { Collapse, Stack } from '@mui/material';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { CampaignProcess } from '@/components/molecules';
import { DialogAllEnrichments } from './DrawerActionsMenu/base';
import {
  DrawerActionsMenu,
  DrawerCellDetails,
  DrawerEditColumn,
  DrawerWebResearch,
  WorkEmail,
} from './index';

import { useEnrichmentTableStore } from '@/stores/enrichment';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import { ActiveCellParams } from '@/types';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

interface DrawerContainerProps {
  tableId: string;
  cellDetails: ActiveCellParams;
  onInitializeAiColumns: () => Promise<void>;
}

export const DrawerContainer: FC<DrawerContainerProps> = ({
  tableId,
  cellDetails,
  onInitializeAiColumns,
}) => {
  // Get dialog state from store - 分别选择避免对象引用导致的无限更新
  const dialogType = useEnrichmentTableStore((state) => state.dialogType);
  const dialogVisible = useEnrichmentTableStore((state) => state.dialogVisible);
  const drawersType = useEnrichmentTableStore((state) => state.drawersType);
  const { setDialogAllEnrichmentsVisible, dialogAllEnrichmentsVisible } =
    useActionsStore(
      useShallow((store) => ({
        setDialogAllEnrichmentsVisible: store.setDialogAllEnrichmentsVisible,
        dialogAllEnrichmentsVisible: store.dialogAllEnrichmentsVisible,
      })),
    );

  return (
    <Collapse
      in={dialogVisible && (drawersType as string[]).includes(dialogType || '')}
      orientation={'horizontal'}
      slotProps={{
        wrapper: {
          sx: { height: '100%' },
        },
      }}
      sx={{ height: '100% !important', position: 'relative' }}
    >
      <Stack
        gap={2}
        sx={{
          maxWidth: 500,
          width: 500,
          height: '100%',
          // transition: 'width 0.3s ease',
          borderLeft: '1px solid',
          borderColor: 'border.default',
        }}
      >
        {/* Conditional Dialogs - Show based on dialogType and dialogVisible */}
        {dialogVisible && (
          <>
            {dialogType === TableColumnMenuActionEnum.actions_overview && (
              <DrawerActionsMenu tableId={tableId} />
            )}
            {dialogType === TableColumnMenuActionEnum.edit_column && (
              <DrawerEditColumn />
            )}
            {dialogType === TableColumnMenuActionEnum.cell_detail && (
              <DrawerCellDetails cellDetails={cellDetails} />
            )}
            {dialogType === TableColumnMenuActionEnum.work_email && (
              <WorkEmail onCloseToCallback={onInitializeAiColumns} />
            )}
            {dialogType === TableColumnMenuActionEnum.ai_agent && (
              <DrawerWebResearch cb={onInitializeAiColumns} tableId={tableId} />
            )}
          </>
        )}

        <CampaignProcess />
        <DialogAllEnrichments
          onClose={() => {
            setDialogAllEnrichmentsVisible(false);
          }}
          open={dialogAllEnrichmentsVisible}
        />
      </Stack>
    </Collapse>
  );
};
