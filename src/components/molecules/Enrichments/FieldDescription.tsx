import { Stack, Typography } from '@mui/material';
import React, { FC } from 'react';

import {
  StyledButton,
  StyledDialog,
  StyledDialogProps,
  StyledTextField,
} from '@/components/atoms';

type FieldDescriptionProps = StyledDialogProps & {
  defaultValue?: string;
};

export const FieldDescription: FC<FieldDescriptionProps> = ({
  defaultValue,
  ...rest
}) => {
  const [description, setDescription] = React.useState(defaultValue || '');

  return (
    <StyledDialog
      content={
        <Stack gap={1} py={1.5}>
          <Typography fontWeight={600} variant={'body3'}>
            Column description
          </Typography>
          <StyledTextField
            maxRows={3}
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
          <StyledButton color={'info'} size={'medium'} variant={'outlined'}>
            Cancel
          </StyledButton>
          <StyledButton size={'medium'} variant={'contained'}>
            Save changes
          </StyledButton>
        </Stack>
      }
      header={'Edit column description'}
      {...rest}
    />
  );
};
