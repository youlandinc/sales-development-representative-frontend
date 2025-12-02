import { Dispatch, SetStateAction, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';

import { useSettingsStore } from '@/stores/useSettingsStore';
import {
  StyledButton,
  StyledDialog,
  StyledSelect,
  StyledTextField,
} from '@/components/atoms';
import { EmailDomainState } from '@/types';

import { CommonVerticalLabelContainer } from '@/components/molecules/Common';

interface SettingsDialogProps {
  onCancelDialog: () => void;
  visible: boolean;
  saveDisabled: boolean;
  saveLoading: boolean;
  onClickSave: () => void;
  mailboxPrefix: string;
  setMailboxPrefix: Dispatch<SetStateAction<string>>;
  domain: string;
  setDomain: Dispatch<SetStateAction<string>>;
}

export const SettingsDialog = ({
  onCancelDialog,
  visible,
  saveDisabled,
  saveLoading,
  onClickSave,
  mailboxPrefix,
  setMailboxPrefix,
  domain,
  setDomain,
}: SettingsDialogProps) => {
  const emailDomainList = useSettingsStore((state) => state.emailDomainList);

  const domainOptions = useMemo(() => {
    return emailDomainList
      .filter((item) =>
        [EmailDomainState.ACTIVE, EmailDomainState.SUCCESS].includes(
          item.validStatus,
        ),
      )
      .map((item) => ({
        label: item.emailDomain,
        value: item.emailDomain,
        key: item.id,
      }));
  }, [emailDomainList]);

  const renderContent = useMemo(() => {
    return (
      <Stack alignItems={'flex-end'} flexDirection={'row'} gap={1.5}>
        <CommonVerticalLabelContainer
          label="Mailbox prefix"
          tooltip="The first part of the email address before the “@” (e.g., john in john@yourdomain.com). Each mailbox must be tied to a verified domain (from the step above)."
        >
          <StyledTextField
            disabled={saveLoading}
            fullWidth
            label={''}
            onChange={(e) => setMailboxPrefix(e.target.value)}
            placeholder={'Mailbox prefix'}
            value={mailboxPrefix}
          />
        </CommonVerticalLabelContainer>
        <Typography
          color="#363440"
          fontSize={16}
          lineHeight={'40px'}
          width={15}
        >
          @
        </Typography>
        <CommonVerticalLabelContainer
          label="Domain"
          tooltip="The domain after the “@” (e.g., yourdomain.com). Only domains verified in the previous step will appear here."
        >
          <StyledSelect
            disabled={saveLoading}
            fullWidth
            onChange={(e) => setDomain(e.target.value as string)}
            options={domainOptions}
            value={domain}
          />
        </CommonVerticalLabelContainer>
      </Stack>
    );
  }, [
    mailboxPrefix,
    domainOptions,
    domain,
    setDomain,
    saveLoading,
    setMailboxPrefix,
  ]);

  return (
    <StyledDialog
      content={renderContent}
      disableEscapeKeyDown
      footer={
        <Stack
          flexDirection={'row'}
          gap={1.5}
          justifyContent={'flex-end'}
          pt={3}
          width={'100%'}
        >
          <StyledButton
            onClick={onCancelDialog}
            sx={{
              height: '40px !important',
              color: '#1E1645',
              borderColor: '#DFDEE6 !important',
            }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            disabled={saveDisabled}
            loading={saveLoading}
            onClick={onClickSave}
            sx={{
              width: '57px',
              height: '40px !important',
              backgroundColor: '#6E4EFB',
            }}
            variant={'contained'}
          >
            Save
          </StyledButton>
        </Stack>
      }
      header={
        <Stack
          alignItems={'flex-start'}
          flexDirection={'column'}
          gap={1.5}
          pb={3}
          width={'100%'}
        >
          <Typography
            color={'#202939'}
            fontSize={18}
            lineHeight={1.2}
            variant={'h6'}
          >
            Set up mailbox
          </Typography>
        </Stack>
      }
      open={visible}
      sx={{
        '&.MuiDialog-root': {
          '& .MuiPaper-root': {
            maxWidth: 600,
          },
        },
      }}
    />
  );
};
