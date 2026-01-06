import { FC, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useShallow } from 'zustand/react/shallow';

import { StyledButton, StyledDialog } from '@/components/atoms';

import { useEnrichmentTableStore, useTableColumns } from '@/stores/enrichment';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

import ICON_CLOSE_THIN from '../assets/dialog/icon_close_thin.svg';

interface DialogDeleteColumnProps {
  tableId: string;
}

export const DialogDeleteColumn: FC<DialogDeleteColumnProps> = ({
  tableId,
}) => {
  const {
    dialogVisible,
    dialogType,
    activeColumnId,
    deleteColumn,
    closeDialog,
  } = useEnrichmentTableStore((state) => state);

  // Get merged columns
  const columns = useTableColumns();

  const { fetchActionsMenus } = useActionsStore(
    useShallow((state) => ({
      fetchActionsMenus: state.fetchActionsMenus,
    })),
  );

  const [deleting, setDeleting] = useState(false);

  return (
    <StyledDialog
      content={
        <Typography
          sx={{
            mt: 1.5,
            mb: 3,
            fontSize: 14,
            color: 'text.secondary',
          }}
        >
          Are you sure you want to delete{' '}
          <Typography component={'span'} sx={{ fontSize: 14, fontWeight: 600 }}>
            {columns.find((item) => item.fieldId === activeColumnId)
              ?.fieldName || 'this column'}
          </Typography>
          ? You can&#39;t undo this.
        </Typography>
      }
      footer={
        <Stack
          sx={{
            flexDirection: 'row',
            gap: 1.5,
          }}
        >
          <StyledButton
            color={'info'}
            onClick={() => closeDialog()}
            size={'medium'}
            sx={{ width: 68 }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            color={'error'}
            disabled={deleting}
            loading={deleting}
            onClick={async () => {
              if (deleting) {
                return;
              }
              setDeleting(true);
              await deleteColumn();
              setDeleting(false);
              fetchActionsMenus(tableId);
            }}
            size={'medium'}
            sx={{ width: 68 }}
          >
            Delete
          </StyledButton>
        </Stack>
      }
      header={
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            Confirm delete column
          </Typography>
          <Icon
            component={ICON_CLOSE_THIN}
            onClick={() => closeDialog()}
            sx={{ height: 24, width: 24, ml: 'auto', cursor: 'pointer' }}
          />
        </Stack>
      }
      onClose={() => closeDialog()}
      open={dialogVisible && dialogType === TableColumnMenuActionEnum.delete}
    />
  );
};
