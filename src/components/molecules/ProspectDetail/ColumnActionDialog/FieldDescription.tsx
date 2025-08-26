import { Stack, Typography } from '@mui/material';
import React, { FC, useEffect } from 'react';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledDialogProps,
  StyledTextField,
} from '@/components/atoms';

import { useAsyncFn } from '@/hooks';

import { _updateTableColumnConfig } from '@/request';
import { HttpError } from '@/types';

type FieldDescriptionProps = StyledDialogProps & {
  defaultValue?: string;
  onClose?: () => void;
  fieldId: string;
  cb?: () => Promise<void>;
};

export const FieldDescription: FC<FieldDescriptionProps> = ({
  defaultValue,
  onClose,
  fieldId,
  cb,
  ...rest
}) => {
  const [description, setDescription] = React.useState(defaultValue || '');

  const [state, updateDescription] = useAsyncFn(
    async (description: string) => {
      try {
        await _updateTableColumnConfig({ fieldId, description });
        await cb?.();
        onClose?.();
      } catch (error) {
        const { message, header, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [fieldId],
  );

  const handleClose = () => {
    onClose?.();
    setDescription('');
  };

  useEffect(() => {
    if (defaultValue) {
      setDescription(defaultValue);
    }
  }, [defaultValue]);

  return (
    <StyledDialog
      content={
        <Stack gap={1} py={1.5}>
          <Typography fontWeight={600} variant={'body3'}>
            Column description
          </Typography>
          <StyledTextField
            multiline
            onChange={(e) => setDescription(e.target.value)}
            placeholder={'Briefly describe what this column contains'}
            rows={3}
            value={description}
          />
        </Stack>
      }
      footer={
        <Stack flexDirection={'row'} gap={1.5}>
          <StyledButton
            color={'info'}
            onClick={handleClose}
            size={'medium'}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            loading={state.loading}
            onClick={() => {
              updateDescription(description);
            }}
            size={'medium'}
            sx={{ width: 125 }}
            variant={'contained'}
          >
            Save changes
          </StyledButton>
        </Stack>
      }
      header={'Edit column description'}
      onClose={handleClose}
      {...rest}
    />
  );
};
