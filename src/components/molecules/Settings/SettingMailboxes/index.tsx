import { FC } from 'react';

import { EmailDomainDetails } from '@/types';

import { SettingsContent, SettingsDialog, SettingsRemove } from './components';
import { SettingsBox } from '../SettingsBox';
import { SettingsButton } from '../SettingsButton';
import { useDialog, useDialogRemove, useFetchMailboxes } from './hooks';

interface SettingMailboxesProps {
  emailDomainList: EmailDomainDetails[];
}

export const SettingMailboxes: FC<SettingMailboxesProps> = ({
  emailDomainList,
}) => {
  const { loading, mailboxes, onRefresh } = useFetchMailboxes();
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
  } = useDialog({ onRefresh, emailDomainList });
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
        <SettingsButton
          label="Add mailbox"
          onClick={onAddMailbox}
          width="95px"
        />
      }
      subtitle="Add your sending accounts under a verified domain. Each mailbox represents a real email account used to send messages."
      title="Mailboxes"
    >
      <SettingsContent
        data={mailboxes}
        loading={loading}
        onClickEdit={onClickEdit}
        onRemove={onRemove}
      />
      <SettingsDialog
        domain={domain}
        emailDomainList={emailDomainList}
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
