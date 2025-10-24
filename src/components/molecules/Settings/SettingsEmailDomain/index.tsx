import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { useBreakpoints } from '@/hooks';

import {
  SettingsEmailDomainContent,
  SettingsEmailDomainDialog,
  SettingsEmailDomainDialogRemove,
  SettingsEmailDomainHeader,
} from './components';
import {
  useDialog,
  useDialogRemove,
  useFetchCustomEmailDomain,
  useKeyDown,
} from './hooks';

export const SettingsEmailDomain: FC = () => {
  const breakpoints = useBreakpoints();
  // Integrate duplicate data
  const isSmall = useMemo(
    () => ['xs', 'sm', 'md'].includes(breakpoints),
    [breakpoints],
  );

  const { loading, emailDomainList, setEmailDomainList, onRefresh } =
    useFetchCustomEmailDomain();

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
    <Stack component={'form'} gap={'12px'} maxWidth={'900px'}>
      <SettingsEmailDomainHeader onAddEmailDomain={onAddEmailDomain} />

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
    </Stack>
  );
};
