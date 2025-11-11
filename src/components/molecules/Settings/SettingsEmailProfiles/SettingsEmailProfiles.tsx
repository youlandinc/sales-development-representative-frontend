import { Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { FC } from 'react';

import {
  StyledButton,
  StyledDialog,
  StyledMultiSelect,
  StyledSelect,
  StyledSwitch,
  StyledTextField,
} from '@/components/atoms';
import { SettingsBox } from '../SettingsBox';
import { StyledTooltipLabel } from './base';

import { useEmailProfilesRequest } from './hooks';

const StyledTinyEditor = dynamic(
  () =>
    import('@/components/atoms/StyledTinyEditor').then(
      (mod) => mod.StyledTinyEditor,
    ),
  {
    ssr: false,
  },
);

export const SettingsEmailProfiles: FC = () => {
  const {
    data,
    visible,
    deleteVisible,
    close,
    deleteClose,
    onClickCreateProfile,
    onClickEdit,
    onClickDelete,
    name,
    setName,
    content,
    setContent,
    connectedMailboxes,
    setConnectedMailboxes,
    defaultMailbox,
    setDefaultMailbox,
    mailboxes,
    rotationEnabled,
    setRotationEnabled,
    deleteEmailProfile,
    submitMethod,
    deleteState,
  } = useEmailProfilesRequest();

  return (
    <SettingsBox
      button={
        <StyledButton
          color="info"
          onClick={onClickCreateProfile}
          size={'small'}
          sx={{
            py: '6px !important',
            fontWeight: 400,
            borderColor: '#DFDEE6 !important',
          }}
          variant={'outlined'}
        >
          Create profile
        </StyledButton>
      }
      subtitle={
        'Create profiles to define your sender name, signature, and which mailboxes to use for sending.'
      }
      title={'Email profiles'}
    >
      {/* Table */}
      <Stack gap={1.5}>
        <Stack flex={1} flexDirection={'row'} gap={1.5}>
          <Typography color={'text.secondary'} flex={1} variant={'body3'}>
            Name
          </Typography>
          <Typography color={'text.secondary'} flex={1} variant={'body3'}>
            Mailboxes
          </Typography>
          <Typography color={'text.secondary'} flex={1} variant={'body3'}>
            Default mailbox
          </Typography>
          <Typography color={'text.secondary'} flex={1} variant={'body3'}>
            Mailbox rotation
          </Typography>
          <Typography
            color={'text.secondary'}
            flex={1}
            variant={'body3'}
          ></Typography>
        </Stack>

        {(data || []).map((profile) => (
          <Stack flexDirection={'row'} gap={1.5} key={profile.id}>
            <Typography flex={1} fontWeight={600} variant={'body3'}>
              {profile.senderName}
            </Typography>
            <Typography flex={1} variant={'body3'}>
              {profile.mailboxList.length} mailbox
              {profile.mailboxList.length > 1 ? 'es' : ''}
            </Typography>
            <Typography flex={1} variant={'body3'}>
              {profile.defaultMailbox?.mailboxName}
            </Typography>
            <Typography flex={1} variant={'body3'}>
              {profile.rotationEnabled ? 'On' : 'Off'}
            </Typography>
            <Stack
              flex={1}
              flexDirection={'row'}
              gap={1.5}
              justifyContent={'flex-end'}
            >
              <Typography
                color="primary"
                onClick={() => onClickEdit(profile)}
                sx={{ cursor: 'pointer' }}
                variant={'body3'}
              >
                Edit
              </Typography>
              <Typography
                color="text.secondary"
                onClick={() => onClickDelete(profile.id)}
                sx={{ cursor: 'pointer' }}
                variant={'body3'}
              >
                Delete
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <StyledDialog
        content={
          <Stack gap={3} pt={3}>
            <StyledTooltipLabel
              label={'Signature name'}
              tooltip={
                "The name that appears in recipients' inboxes. Use your real name or a consistent team identity (e.g., Alex from Marketing or Customer Success Team)."
              }
            >
              <StyledTextField
                onChange={(e) => setName(e.target.value)}
                placeholder={'Sender name (ex: Tim Cook)'}
                value={name}
              />
            </StyledTooltipLabel>
            <StyledTooltipLabel
              label={'Email signature'}
              tooltip={
                'The closing block added to every email you send. Include details like your name, title, and contact info (e.g., “Best, Alex - Marketing Manager”).'
              }
            >
              <StyledTinyEditor
                onChange={(content) => {
                  setContent(content);
                }}
                placeholder={'Autosize height based on content lines'}
                value={content}
              />
            </StyledTooltipLabel>
            <StyledTooltipLabel
              label={'Connected mailboxes'}
              tooltip={
                'The email addresses your messages will be sent from (e.g., outreach@company.com). These mailboxes will be linked to this email profile — any campaigns sent using this profile will use them to send emails.'
              }
            >
              <StyledMultiSelect
                multiple
                onChange={(_, newValue) => {
                  setConnectedMailboxes(newValue);
                  if (
                    defaultMailbox !== '' &&
                    !newValue.find((item) => item.value === defaultMailbox)
                  ) {
                    setDefaultMailbox('');
                  }
                }}
                options={mailboxes}
                value={connectedMailboxes}
              />
            </StyledTooltipLabel>
            <StyledTooltipLabel
              label={'Default mailbox'}
              tooltip={
                'The primary email address used when sending from this profile. If rotation is off, all emails will send from this mailbox. If rotation is on, it serves as the fallback when others are paused or reach their limits.'
              }
            >
              <StyledSelect
                disabled={!connectedMailboxes.length}
                onChange={(e) => {
                  setDefaultMailbox(e.target.value as string);
                }}
                options={connectedMailboxes}
                value={defaultMailbox}
              />
            </StyledTooltipLabel>
            <StyledTooltipLabel
              alignItems={'center'}
              flexDirection={'row'}
              label={'Mailbox rotation'}
              tooltip={
                'When enabled, outgoing emails are evenly distributed across all connected mailboxes in this profile to improve deliverability and reduce throttling.'
              }
            >
              <StyledSwitch
                checked={rotationEnabled}
                onChange={(e) => {
                  setRotationEnabled(e.target.checked);
                }}
              />
            </StyledTooltipLabel>
          </Stack>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5} pt={3}>
            <StyledButton
              color={'info'}
              onClick={() => {
                close();
              }}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={
                name.trim() === '' ||
                content?.trim() === '' ||
                connectedMailboxes.length === 0 ||
                defaultMailbox === ''
              }
              loading={submitMethod.state.loading}
              onClick={() => submitMethod.request()}
              size={'medium'}
              sx={{ width: 63 }}
            >
              Save
            </StyledButton>
          </Stack>
        }
        header={'Email signature'}
        onClose={close}
        open={visible}
        slotProps={{
          paper: {
            sx: {
              minWidth: 900,
            },
          },
        }}
      />
      <StyledDialog
        content={
          <Typography color={'text.secondary'} pt={'18px'} variant={'body2'}>
            Once deleted, this email profile and its mailbox settings will be
            removed.
          </Typography>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5} pt={3}>
            <StyledButton
              color={'info'}
              onClick={() => {
                deleteClose();
              }}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              color={'error'}
              disabled={deleteState.loading}
              loading={deleteState.loading}
              onClick={() => deleteEmailProfile()}
              size={'medium'}
              sx={{ width: 75 }}
            >
              Delete
            </StyledButton>
          </Stack>
        }
        header={'Are you sure you want to delete this email profile?'}
        onClose={deleteClose}
        open={deleteVisible}
      />
    </SettingsBox>
  );
};
