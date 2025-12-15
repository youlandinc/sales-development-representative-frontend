import { Collapse, Stack } from '@mui/material';
import { FC } from 'react';

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

import { useProspectTableStore } from '@/stores/enrichment';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

interface DialogActionsContainerProps {
  tableId: string;
  cellDetails: Record<string, any>;
  onInitializeAiColumns: () => Promise<void>;
}

export const DrawerActionsContainer: FC<DialogActionsContainerProps> = ({
  tableId,
  cellDetails,
  onInitializeAiColumns,
}) => {
  // Get dialog state from store - 分别选择避免对象引用导致的无限更新
  const dialogType = useProspectTableStore((state) => state.dialogType);
  const dialogVisible = useProspectTableStore((state) => state.dialogVisible);
  const drawersType = useProspectTableStore((state) => state.drawersType);

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
              <DialogActionsMenu />
            )}
            {dialogType === TableColumnMenuActionEnum.edit_column && (
              <DialogEditColumn />
            )}
            {dialogType === TableColumnMenuActionEnum.cell_detail && (
              <DialogCellDetails data={cellDetails} />
            )}
            {dialogType === TableColumnMenuActionEnum.work_email && (
              <DialogWorkEmail cb={onInitializeAiColumns} />
            )}
            {dialogType === TableColumnMenuActionEnum.web_research && (
              <DialogWebResearch cb={onInitializeAiColumns} tableId={tableId} />
            )}
          </>
        )}
        <DialogEditDescription />
        <DialogDeleteColumn />
        <CampaignProcess />
      </Stack>
    </Collapse>
  );
};
