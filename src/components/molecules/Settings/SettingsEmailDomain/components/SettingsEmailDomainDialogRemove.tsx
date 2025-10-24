import { Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog } from '@/components/atoms';
import { EmailDomainDetails } from '@/types';

interface SettingsEmailDomainDialogRemoveProps {
  deleteItem?: EmailDomainDetails;
  deleteClose: () => void;
  deleteLoading: boolean;
  onClickToDelete: () => void;
  deleteVisible: boolean;
}

export const SettingsEmailDomainDialogRemove = ({
  deleteItem,
  deleteClose,
  deleteLoading,
  onClickToDelete,
  deleteVisible,
}: SettingsEmailDomainDialogRemoveProps) => {
  return (
    <StyledDialog
      content={
        <Typography color={'#636A7C'} my={3} variant={'body2'}>
          Are you sure you want to delete{' '}
          {deleteItem?.email || deleteItem?.emailDomain}
        </Typography>
      }
      footer={
        <Stack
          flexDirection={'row'}
          gap={1.5}
          justifyContent={'flex-end'}
          width={'100%'}
        >
          <StyledButton
            onClick={deleteClose}
            size={'small'}
            sx={{
              width: 70,
              height: '40px !important',
              color: '#1E1645',
              borderColor: '#DFDEE6 !important',
            }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            disabled={deleteLoading}
            loading={deleteLoading}
            onClick={onClickToDelete}
            size={'small'}
            sx={{
              width: 70,
              height: '40px !important',
              color: '#fff',
              backgroundColor: '#6E4EFB',
            }}
          >
            Delete
          </StyledButton>
        </Stack>
      }
      header={
        <Typography
          color={'#202939'}
          fontSize={18}
          lineHeight={1.2}
          variant={'h6'}
        >
          Delete domain?
        </Typography>
      }
      open={deleteVisible}
    />
  );
};
