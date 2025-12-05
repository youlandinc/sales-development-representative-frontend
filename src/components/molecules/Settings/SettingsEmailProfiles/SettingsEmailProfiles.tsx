import { Skeleton, Stack, Typography } from '@mui/material';
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
import { CommonVerticalLabelContainer } from '@/components/molecules/Common';

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
    onClickCancel,
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
    isLoading,
  } = useEmailProfilesRequest();

  return (
    <SettingsBox
      button={
        <StyledButton
          color="info"
          onClick={onClickCreateProfile}
          size={'small'}
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
        {isLoading ? (
          // Skeleton loader
          <Stack gap={1.5}>
            <Stack flex={1} flexDirection={'row'} gap={1.5}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} sx={{ flex: 1 }} variant="rounded" />
              ))}
            </Stack>
          </Stack>
        ) : (data || []).length > 0 ? (
          // Actual data table
          <>
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
          </>
        ) : null}
      </Stack>
      <StyledDialog
        content={
          <Stack gap={3} pt={3}>
            <CommonVerticalLabelContainer
              label={'Sender name'}
              tooltip={
                "The name that appears in recipients' inboxes. Use your real name or a consistent team identity (e.g., Alex from Marketing or Customer Success Team)."
              }
            >
              <StyledTextField
                onChange={(e) => setName(e.target.value)}
                placeholder={'Sender name (ex: Tim Cook)'}
                value={name}
              />
            </CommonVerticalLabelContainer>
            <CommonVerticalLabelContainer
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
                showSignatureButton={false}
                value={content}
              />
            </CommonVerticalLabelContainer>
            <CommonVerticalLabelContainer
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
                placeholder={'Connected mailboxes'}
                value={connectedMailboxes}
              />
            </CommonVerticalLabelContainer>
            <CommonVerticalLabelContainer
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
                placeholder={'Default mailbox'}
                value={defaultMailbox}
              />
            </CommonVerticalLabelContainer>
            <CommonVerticalLabelContainer
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
            </CommonVerticalLabelContainer>
          </Stack>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5} pt={3}>
            <StyledButton
              color={'info'}
              onClick={onClickCancel}
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
        header={'Create email profile'}
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
