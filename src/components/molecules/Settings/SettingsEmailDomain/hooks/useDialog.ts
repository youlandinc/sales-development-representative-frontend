import { useCallback, useState } from 'react';

import { useSwitch } from '@/hooks';
import {
  _addCustomEmailDomain,
  _fetchIdentityCustomEmailDomain,
  _modifyCustomEmailDomain,
  _verifyCustomEmailDomain,
} from '@/request';
import {
  EmailDomainData,
  EmailDomainState,
  HttpError,
  HttpVariantEnum,
} from '@/types';
import { SDRToast } from '@/components/atoms';
import { useUserStore } from '@/providers';
import { useSettingsStore } from '@/stores/useSettingsStore';

interface UseDialogProps {
  onOpenVerified: () => void;
}

export const useDialog = ({ onOpenVerified }: UseDialogProps) => {
  const { userProfile } = useUserStore((state) => state);
  const { emailDomainList, fetchEmailDomainList } = useSettingsStore(
    (state) => state,
  );
  const { tenantId } = userProfile;

  const { open, close, visible } = useSwitch(false);

  const [viewLoading, setViewLoading] = useState(false);
  const [stepButtonLoading, setStepButtonLoading] = useState<boolean>(false);

  const [activeStep, setActiveStep] = useState(0);

  const [domain, setDomain] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const [domainVerifyList, setDomainVerifyList] = useState<EmailDomainData[]>(
    [],
  );

  const onAddEmailDomain = useCallback(async () => {
    setActiveStep(0);
    open();
  }, [setActiveStep, open]);

  const onCancelDialog = useCallback(() => {
    close();
    setTimeout(() => {
      setActiveStep(0);
      setUserName('');
      setDomain('');
      setDomainVerifyList([]);
      setViewLoading(false);
      setStepButtonLoading(false);
    }, 200);
  }, [close]);

  const onClickView = useCallback(
    async (domain: string) => {
      setDomain(domain);
      const target = emailDomainList.find(
        (item) => item.emailDomain === domain,
      );
      if (target) {
        const { validStatus, userName } = target;
        switch (validStatus) {
          case EmailDomainState.PENDING:
          case EmailDomainState.FAILED:
            setActiveStep(1);
            setViewLoading(true);
            try {
              const { data } = await _fetchIdentityCustomEmailDomain({
                domain: target.emailDomain,
              });
              setDomainVerifyList(data);
            } catch (err) {
              const { header, message, variant } = err as HttpError;
              SDRToast({ message, header, variant });
            }
            break;
          case EmailDomainState.SUCCESS:
          case EmailDomainState.ACTIVE:
            userName && setUserName(userName);
            setActiveStep(2);
            break;
        }
      } else {
        setActiveStep(0);
      }
      setViewLoading(false);
      open();
    },
    [emailDomainList, open],
  );

  const onClickContinue = useCallback(async () => {
    if (!domain) {
      return;
    }
    setStepButtonLoading(true);
    try {
      const { data } = await _addCustomEmailDomain({ domain });
      setDomainVerifyList(data);
      await fetchEmailDomainList(tenantId);
      setTimeout(() => {
        setActiveStep(1);
      }, 10);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setStepButtonLoading(false);
    }
  }, [domain, tenantId, fetchEmailDomainList]);

  const onClickVerify = useCallback(
    async (domain: string) => {
      const target = emailDomainList.find(
        (item) => item.emailDomain === domain,
      );
      if (!target) {
        return;
      }
      setStepButtonLoading(true);
      try {
        const { emailDomain } = target;
        const { data: verifyData } = await _verifyCustomEmailDomain({
          domain: emailDomain,
        });
        await fetchEmailDomainList(tenantId);
        if (
          [EmailDomainState.SUCCESS, EmailDomainState.ACTIVE].includes(
            verifyData.validStatus,
          )
        ) {
          onCancelDialog();
          onOpenVerified();
        }
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setStepButtonLoading(false);
      }
    },
    [
      emailDomainList,
      tenantId,
      onOpenVerified,
      onCancelDialog,
      fetchEmailDomainList,
    ],
  );

  const onClickSave = useCallback(
    async (domain: string) => {
      const target = emailDomainList.find(
        (item) => item.emailDomain === domain,
      );
      if (!target) {
        return;
      }
      setStepButtonLoading(true);
      const { id } = target;
      const params = {
        id,
        userName,
      };
      try {
        await _modifyCustomEmailDomain(params);
        await fetchEmailDomainList(tenantId);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setStepButtonLoading(false);
      }
      onCancelDialog();
    },
    [onCancelDialog, emailDomainList, tenantId, userName, fetchEmailDomainList],
  );

  const onClickCopy = useCallback(async (type: string, text: string) => {
    await navigator.clipboard.writeText(text);
    SDRToast({
      message: '',
      header: `Copied ${type} to clipboard`,
      variant: HttpVariantEnum.success,
    });
  }, []);

  return {
    activeStep,
    setActiveStep,
    onAddEmailDomain,
    onClickView,
    onCancelDialog,
    viewLoading,
    domain,
    setDomain,
    domainVerifyList,
    userName,
    setUserName,
    stepButtonLoading,
    visible,
    onClickContinue,
    onClickVerify,
    onClickSave,
    onClickCopy,
  };
};
