import { FC, useMemo } from 'react';

import { useBreakpoints } from '@/hooks';

import {
  SettingsEmailDomainContent,
  SettingsEmailDomainDialog,
  SettingsEmailDomainDialogRemove,
  SettingsEmailDomainDialogVerified,
} from './components';
import {
  useDialog,
  useDialogRemove,
  useDialogVerified,
  useFetchCustomEmailDomain,
  useKeyDown,
} from './hooks';
import { SettingsBox } from '../SettingsBox';
import { SettingsButton } from '../SettingsButton';

export const SettingsEmailDomain: FC = () => {
  const breakpoints = useBreakpoints();
  // Integrate duplicate data
  const isSmall = useMemo(
    () => ['xs', 'sm', 'md'].includes(breakpoints),
    [breakpoints],
  );

  const { loading, onRefresh } = useFetchCustomEmailDomain();

  const {
    close: verifiedClose,
    visible: verifiedVisible,
    onOpenVerified,
    onClickSetupMailbox,
  } = useDialogVerified();

  const {
    activeStep,
    setActiveStep,
    onAddEmailDomain,
    onClickView,
    viewLoading,
    domain,
    setDomain,
    domainVerifyList,
    userName,
    setUserName,
    stepButtonLoading,
    visible,
    onCancelDialog,
    onClickContinue,
    onClickVerify,
    onClickSave,
    onClickCopy,
  } = useDialog({
    onOpenVerified,
  });

  const {
    deleteItem,
    deleteLoading,
    onClickToDelete,
    onRemove,
    close: deleteClose,
    visible: deleteVisible,
  } = useDialogRemove({ onRefresh, setActiveStep });

  useKeyDown({
    activeStep,
  });

  return (
    <SettingsBox
      button={
        <SettingsButton
          label="Add domain"
          onClick={onAddEmailDomain}
          width="95px"
        />
      }
      subtitle="Verify your domains to start sending emails. You can only add mailboxes under verified domains."
      title="Domains"
    >
      <SettingsEmailDomainContent
        domain={domain}
        loading={loading}
        onClickView={onClickView}
        onRemove={onRemove}
        viewLoading={viewLoading}
      />

      <SettingsEmailDomainDialog
        activeStep={activeStep}
        domain={domain}
        domainVerifyList={domainVerifyList}
        isSmall={isSmall}
        onCancelDialog={onCancelDialog}
        onClickContinue={onClickContinue}
        onClickCopy={onClickCopy}
        onClickSave={onClickSave}
        onClickVerify={onClickVerify}
        setDomain={setDomain}
        setUserName={setUserName}
        stepButtonLoading={stepButtonLoading}
        userName={userName}
        visible={visible}
      />

      <SettingsEmailDomainDialogRemove
        deleteClose={deleteClose}
        deleteItem={deleteItem}
        deleteLoading={deleteLoading}
        deleteVisible={deleteVisible}
        onClickToDelete={onClickToDelete}
      />

      <SettingsEmailDomainDialogVerified
        onClickSetupMailbox={onClickSetupMailbox}
        verifiedClose={verifiedClose}
        verifiedVisible={verifiedVisible}
      />
    </SettingsBox>
  );
};
