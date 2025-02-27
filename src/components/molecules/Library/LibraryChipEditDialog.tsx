import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';

import {
  StyledButton,
  StyledDialog,
  StyledDialogProps,
} from '@/components/atoms';
import { StyledVerticalTextField } from '@/components/molecules';

import { ITag } from '@/stores/useLibraryStore';

type LibraryChipEditDialogProps = StyledDialogProps &
  Omit<ITag, 'id'> & {
    handleSave?: (param: ITag) => Promise<void>;
    uid: number;
    loading?: boolean;
  };

export const LibraryChipEditDialog: FC<LibraryChipEditDialogProps> = ({
  open,
  onClose,
  name,
  description,
  handleSave,
  uid,
  loading,
  ...rest
}) => {
  const [libName, setLibName] = useState('');
  const [desc, setDescription] = useState('');

  useEffect(() => {
    description && setDescription(description);
    name && setLibName(name);
  }, [name, description, open]);

  const handleClose = () => {
    onClose?.({}, 'backdropClick');
    setTimeout(() => {
      setDescription('');
      setLibName('');
    }, 800);
  };

  return (
    <StyledDialog
      content={
        <Stack gap={1.5} py={3}>
          <StyledVerticalTextField
            label={'Name'}
            onChange={(e) => setLibName(e.target.value)}
            required
            toolTipTittle={''}
            value={libName || ''}
          />
          <StyledVerticalTextField
            label={'Description'}
            multiline
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={10}
            sx={{
              '& .MuiOutlinedInput-input': {
                p: 0,
                height: 'auto !important',
              },
            }}
            toolTipTittle={''}
            value={desc || ''}
          />
        </Stack>
      }
      footer={
        <Stack flexDirection={'row'} gap={1.5}>
          <StyledButton
            color={'info'}
            onClick={handleClose}
            size={'medium'}
            sx={{ px: '12px !important' }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            disabled={libName.trim() === '' && desc.trim() === ''}
            loading={loading}
            onClick={async () => {
              await handleSave?.({ name: libName, description: desc, id: uid });
              handleClose();
            }}
            size={'medium'}
            sx={{ alignSelf: 'flex-start', width: 66 }}
          >
            Save
          </StyledButton>
        </Stack>
      }
      onClose={handleClose}
      open={open}
      {...rest}
    />
  );
};
