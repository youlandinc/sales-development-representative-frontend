import { Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog } from '@/components/atoms';

interface SettingsEmailDomainDialogVerifiedProps {
  verifiedClose: () => void;
  onClickSetupMailbox: () => void;
  verifiedVisible: boolean;
}

export const SettingsEmailDomainDialogVerified = ({
  verifiedClose,
  onClickSetupMailbox,
  verifiedVisible,
}: SettingsEmailDomainDialogVerifiedProps) => {
  return (
    <StyledDialog
      content={
        <Typography color={'#363440'} my={3} variant={'body2'}>
          Your domain is verified and ready to use. To start sending emails, add
          at least one mailbox under this domain.
          <div style={{ height: '20px' }} />
          Mailboxes are linked to your sender profiles — if no mailbox exists
          yet, the first one you add will be automatically assigned to your
          default sender profile.
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
            onClick={verifiedClose}
            size={'small'}
            sx={{
              width: 107,
              height: '40px !important',
              color: '#1E1645',
              borderColor: '#DFDEE6 !important',
              fontSize: '14px !important',
            }}
            variant={'outlined'}
          >
            Skip for now
          </StyledButton>
          <StyledButton
            onClick={onClickSetupMailbox}
            size={'small'}
            sx={{
              width: 122,
              height: '40px !important',
              color: '#fff',
              backgroundColor: '#6E4EFB !important',
              fontSize: '14px !important',
            }}
          >
            Set up mailbox
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
          Domain verified
        </Typography>
      }
      open={verifiedVisible}
    />
  );
};
