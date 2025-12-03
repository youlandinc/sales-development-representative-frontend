import { FC, useState } from 'react';
import { Stack, Typography } from '@mui/material';

import { useProspectTableStore } from '@/stores/enrichment';

import { StyledButton, StyledDialog } from '@/components/atoms';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

export const DialogDeleteColumn: FC = () => {
  const {
    dialogVisible,
    dialogType,
    columns,
    activeColumnId,
    deleteColumn,
    closeDialog,
  } = useProspectTableStore((state) => state);

  const [deleting, setDeleting] = useState(false);

  return (
    <StyledDialog
      content={
        <Typography color={'text.secondary'} fontSize={14} my={1.5}>
          Are you sure you want to delete{' '}
          <Typography component={'span'} fontWeight={600}>
            {columns.find((item) => item.fieldId === activeColumnId)
              ?.fieldName || 'this column'}
          </Typography>
          ? You can&#39;t undo this.
        </Typography>
      }
      footer={
        <Stack flexDirection={'row'} gap={3}>
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
            }}
            size={'medium'}
            sx={{ width: 68 }}
          >
            Delete
          </StyledButton>
        </Stack>
      }
      header={'Confirm delete column'}
      onClose={() => closeDialog()}
      open={dialogVisible && dialogType === TableColumnMenuActionEnum.delete}
    />
  );
};
