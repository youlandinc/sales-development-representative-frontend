import { Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog } from '@/components/atoms';

interface SettingsRemoveProps {
  deleteClose: () => void;
  deleteLoading: boolean;
  onClickToDelete: () => void;
  deleteVisible: boolean;
}

export const SettingsRemove = ({
  deleteClose,
  deleteLoading,
  onClickToDelete,
  deleteVisible,
}: SettingsRemoveProps) => {
  return (
    <StyledDialog
      content={
        <Typography color={'#636A7C'} my={'18px'} variant={'body2'}>
          Once deleted, all mailboxes under this domain will be removed and
          you’ll need to reverify it before adding it again.
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
              backgroundColor: '#E26E6E !important',
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
          Are you sure you want to delete this domain?
        </Typography>
      }
      open={deleteVisible}
    />
  );
};
