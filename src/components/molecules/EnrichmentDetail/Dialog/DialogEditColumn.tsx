import { Icon, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { StyledButton, StyledTextField } from '@/components/atoms';
import { CommonSelectFieldType } from '@/components/molecules/Common';

import { TypeIcon } from '../Table/TableIcon';
import {
  TableColumnProps,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

import { useAsyncFn } from '@/hooks';
import { useEnrichmentTableStore, useTableColumns } from '@/stores/enrichment';

import ICON_CLOSE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_close.svg';

interface DialogEditColumnProps {
  cb?: () => void;
}

export const DialogEditColumn: FC<DialogEditColumnProps> = ({ cb }) => {
  const { activeColumnId, closeDialog, updateColumnNameAndType } =
    useEnrichmentTableStore((store) => store);

  // Get merged columns
  const columns = useTableColumns();
  const column = columns.find(
    (col: TableColumnProps) => col.fieldId === activeColumnId,
  );

  const [value, setValue] = useState(TableColumnTypeEnum.text);
  const [name, setName] = useState('');

  const [state, updateDescription] = useAsyncFn(async () => {
    await updateColumnNameAndType({
      fieldName: name,
      fieldType: value,
    });
    closeDialog();
    cb?.();
  }, [value, name]);

  useEffect(() => {
    if (column?.fieldName) {
      setName(column?.fieldName);
    }
    if (column?.fieldType) {
      setValue(column?.fieldType);
    }
  }, [closeDialog, column?.fieldName, column?.fieldType]);

  useEffect(() => {
    return () => {
      closeDialog();
    };
  }, [closeDialog]);

  return (
    <Stack gap={4} height={'100%'}>
      {/* header */}
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={0.5}
        pt={3}
        px={3}
      >
        {column?.fieldType && (
          <TypeIcon
            size={20}
            type={
              (column?.fieldType as TableColumnTypeEnum) ||
              TableColumnTypeEnum.text
            }
          />
        )}
        <Typography fontWeight={600} lineHeight={1.2}>
          {column?.fieldName}
        </Typography>
        <Icon
          component={ICON_CLOSE}
          onClick={closeDialog}
          sx={{ width: 24, height: 24, ml: 'auto', cursor: 'pointer' }}
        />
      </Stack>
      <Stack gap={1.5} px={3}>
        <Stack border={'1px solid #DFDEE6'} borderRadius={2} gap={1.5} p={1.5}>
          <Stack gap={1}>
            <Typography variant={'body2'}>Column name</Typography>
            <StyledTextField
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Stack>
          <Stack gap={1}>
            <Typography variant={'body2'}>Data type</Typography>
            <CommonSelectFieldType
              onChange={(e) => setValue(e.target.value as TableColumnTypeEnum)}
              value={value}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack
        alignItems={'center'}
        borderTop={' 1px solid   #D0CEDA'}
        flexDirection={'row'}
        gap={1}
        justifyContent={'flex-end'}
        mt={'auto'}
        px={3}
        py={1.5}
      >
        <StyledButton
          color={'info'}
          onClick={closeDialog}
          size={'medium'}
          variant={'outlined'}
        >
          Cancel
        </StyledButton>
        <StyledButton
          disabled={name.trim() === ''}
          loading={state.loading}
          onClick={updateDescription}
          size={'medium'}
          sx={{ width: 65 }}
          variant={'contained'}
        >
          Save
        </StyledButton>
      </Stack>
    </Stack>
  );
};
