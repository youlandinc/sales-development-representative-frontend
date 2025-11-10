import { Dispatch, FC, SetStateAction, useMemo } from 'react';

import { useBreakpoints } from '@/hooks';

import {
  SettingsEmailDomainContent,
  SettingsEmailDomainDialog,
  SettingsEmailDomainDialogRemove,
} from './components';
import {
  useDialog,
  useDialogRemove,
  useFetchCustomEmailDomain,
  useKeyDown,
} from './hooks';
import { EmailDomainDetails } from '@/types';
import { SettingsBox } from '../SettingsBox';
import { SettingsButton } from '../SettingsButton';

interface SettingsEmailDomainProps {
  emailDomainList: EmailDomainDetails[];
  setEmailDomainList: Dispatch<SetStateAction<EmailDomainDetails[]>>;
}

export const SettingsEmailDomain: FC<SettingsEmailDomainProps> = ({
  emailDomainList,
  setEmailDomainList,
}) => {
  const breakpoints = useBreakpoints();
  // Integrate duplicate data
  const isSmall = useMemo(
    () => ['xs', 'sm', 'md'].includes(breakpoints),
    [breakpoints],
  );

  const { loading, onRefresh } = useFetchCustomEmailDomain({
    setEmailDomainList,
  });

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
    emailDomainList,
    setEmailDomainList,
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
        data={emailDomainList}
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
    </SettingsBox>
  );
};
