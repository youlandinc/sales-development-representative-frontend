import { FC } from 'react';
import { Box } from '@mui/material';

import { SettingsContent, SettingsDialog, SettingsRemove } from './components';
import { SettingsBox } from '../SettingsBox';
import { SettingsButton } from '../SettingsButton';
import { useDialog, useDialogRemove, useFetchMailboxes } from './hooks';

export const SettingMailboxes: FC = () => {
  const { loading, onRefresh } = useFetchMailboxes();
  const {
    onAddMailbox,
    onClickEdit,
    visible,
    onCancelDialog,
    saveDisabled,
    saveLoading,
    onClickSave,
    mailboxPrefix,
    setMailboxPrefix,
    domain,
    setDomain,
  } = useDialog({ onRefresh });
  const {
    deleteLoading,
    onClickToDelete,
    onRemove,
    close: deleteClose,
    visible: deleteVisible,
  } = useDialogRemove({ onRefresh });

  return (
    <SettingsBox
      button={
        <Box id="add-mailbox-button">
          <SettingsButton
            label="Add mailbox"
            onClick={onAddMailbox}
            width="95px"
          />
        </Box>
      }
      subtitle="Add your sending accounts under a verified domain. Each mailbox represents a real email account used to send messages."
      title="Mailboxes"
    >
      <SettingsContent
        loading={loading}
        onClickEdit={onClickEdit}
        onRemove={onRemove}
      />
      <SettingsDialog
        domain={domain}
        mailboxPrefix={mailboxPrefix}
        onCancelDialog={onCancelDialog}
        onClickSave={onClickSave}
        saveDisabled={saveDisabled}
        saveLoading={saveLoading}
        setDomain={setDomain}
        setMailboxPrefix={setMailboxPrefix}
        visible={visible}
      />
      <SettingsRemove
        deleteClose={deleteClose}
        deleteLoading={deleteLoading}
        deleteVisible={deleteVisible}
        onClickToDelete={onClickToDelete}
      />
    </SettingsBox>
  );
};
