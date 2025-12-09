import { Stack } from '@mui/material';
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

import { useProspectTableStore } from '@/stores/enrichment';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';
import { useProspectTable } from '../hooks';

interface DialogActionsContainerProps {
  tableId: string;
}

export const DrawerActionsContainer: FC<DialogActionsContainerProps> = ({
  tableId,
}) => {
  const { onInitializeAiColumns } = useProspectTable({ tableId });

  // Get dialog state from store - 分别选择避免对象引用导致的无限更新
  const dialogType = useProspectTableStore((state) => state.dialogType);
  const dialogVisible = useProspectTableStore((state) => state.dialogVisible);

  // TODO: Get active cell data from store or props when needed
  const activeCellData = {};

  return (
    <Stack
      gap={2}
      sx={{
        maxWidth: 500,
        width: dialogVisible ? '100%' : 0,
        height: '100%',
        transitionDuration: '0.3s',
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
          {dialogType === TableColumnMenuActionEnum.edit_description && (
            <DialogEditDescription />
          )}

          {dialogType === TableColumnMenuActionEnum.delete && (
            <DialogDeleteColumn />
          )}

          {dialogType === TableColumnMenuActionEnum.edit_column && (
            <DialogEditColumn />
          )}

          {dialogType === TableColumnMenuActionEnum.cell_detail && (
            <DialogCellDetails data={activeCellData} />
          )}
          {dialogType === TableColumnMenuActionEnum.work_email && (
            <DialogWorkEmail cb={onInitializeAiColumns} />
          )}
          {dialogType === TableColumnMenuActionEnum.web_research && (
            <DialogWebResearch cb={onInitializeAiColumns} tableId={tableId} />
          )}
        </>
      )}
    </Stack>
  );
};
