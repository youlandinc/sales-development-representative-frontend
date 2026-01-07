import { Collapse, Stack } from '@mui/material';
import { FC } from 'react';
import { useShallow } from 'zustand/shallow';

import {
  DialogActionsMenu,
  DialogCellDetails,
  DialogDeleteColumn,
  DialogEditColumn,
  DialogEditDescription,
  DialogWebResearch,
  DialogWorkEmail,
} from './index';
import { CampaignProcess } from '@/components/molecules';

import { useEnrichmentTableStore } from '@/stores/enrichment';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';
import { ActiveCellParams } from '@/types';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';
import { DialogAllEnrichments } from './DialogActionsMenu/base';

interface DialogActionsContainerProps {
  tableId: string;
  cellDetails: ActiveCellParams;
  onInitializeAiColumns: () => Promise<void>;
}

export const DrawerActionsContainer: FC<DialogActionsContainerProps> = ({
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
              <DialogActionsMenu tableId={tableId} />
            )}
            {dialogType === TableColumnMenuActionEnum.edit_column && (
              <DialogEditColumn />
            )}
            {dialogType === TableColumnMenuActionEnum.cell_detail && (
              <DialogCellDetails cellDetails={cellDetails} />
            )}
            {dialogType === TableColumnMenuActionEnum.work_email && (
              <DialogWorkEmail onCloseToCallback={onInitializeAiColumns} />
            )}
            {dialogType === TableColumnMenuActionEnum.ai_agent && (
              <DialogWebResearch cb={onInitializeAiColumns} tableId={tableId} />
            )}
          </>
        )}
        <DialogEditDescription />
        <DialogDeleteColumn tableId={tableId} />
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
